---
title: Kubernetes의 Server Side Apply란 무엇일까?
subTitle: 1.22부터 GA로 포함된 이 옵션
date: 2022-12-26
tags:
  - Kubernetes
  - CSA
  - SSA
thumbnail: ./thumbnail.png
---

이번 글에서는 쿠버네티스 1.22부터 GA 버전으로 들어오게된 SSA(Server Side Apply)에 대해 정리해본다.

## `last-applied-configuration`의 역할

SSA에 대해 바로 말하기 전에, 기존의 Apply 방식부터 하나씩 살펴보자.

다음과 같은 Configmap을 정의한 Manifest 파일이 있다고 하자.

```yaml
# cm-csa.yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-csa
data:
  key: "value"
```

이런 Manifest 파일을 쿠버네티스 클러스터에 배포할 때는 보통 다음처럼 `kubectl apply` 명령어를 사용한다.

```bash
$ kubectl apply -f cm-csa.yaml

configmap/cm-csa created
```

만들어진 오브젝트를 확인해보면 다음과 같다.

```yaml
$ kubectl get cm cm-csa -o yaml

apiVersion: v1
data:
  key: value
kind: ConfigMap
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","data":{"key":"value"},"kind":"ConfigMap","metadata":{"annotations":{},"name":"cm-csa","namespace":"default"}}
  creationTimestamp: "2022-12-21T14:28:14Z"
  name: cm-csa
  namespace: default
  resourceVersion: "2193971"
  uid: 33084809-6b86-479e-95af-97d45e38daf6
```

이 때 `metadata.annotataions` 안에 `kubectl.kubernetes.io/last-applied-configuration` 키가 추가가 되어있다.
이 키의 값은 내가 방금 `kubectl apply` 로 제출한 내용을 그대로 담아낸다.

그럼 `kubectl.kubernetes.io/last-applied-configuration` 값은 그럼 어떤 용도로 쓰이는걸까?

우리가 다음 차례에 (미래에 있을) `kubectl apply` 를 할 때, 쿠버네티스가 오브젝트를 업데이트하는 과정에서 쓰인다.
쿠버네티스가 오브젝트를 업데이트 하는 과정은 간략히 다음과 같다.

1. 먼저 오브젝트에서 삭제할 필드를 계산한다. 이 필드들은 `kubectl.kubernetes.io/last-applied-configuration` 내에는 존재하는데, 전달받은 Manifest 파일 내에는 없는 필드들이다.
2. 그런 다음, 추가 또는 설정되어야 할 필드를 계산한다. 이 필드들은 현재 배포되어 있는 오브젝트와 불일치하는 값을 가지는 Manifest 파일 내 존재하는 필드이다.

> 구체적인 예시가 궁금하다면, [이 페이지](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/#merge-patch-calculation)를 참고하자.

이렇듯 `kubectl.kubernetes.io/last-applied-configuration` 는 오브젝트를 업데이트 할 때, 기존 오브젝트와 새 오브젝트 내용을 머지 패치(Merge Patch) 할 때 쓰인다.

## Field Manager

`kubectl apply` 를 실행할 때 위 1, 2 과정과 같이 복잡한 머지 패치를 하지 않고 `kubectl apply -f {Manifest 파일 경로}` 에서 전달받은 Manifest의 내용으로 그냥 덮어써서(Overwrite) 배포해버리면 되는거 아닌가? 싶을 수 있다.
그러나 기본적으로 `kubectl apply` 가 이렇게 덮어쓰지 않고 귀찮더라도 머지 패치를 하는 이유는, `kubectl apply` 을 실행할 때 추가, 수정된 필드를 그대로 보존하기 위함이다.

예를 들어, 다음처럼 위에서 만든 오브젝트에 라벨 `key: value` 을 추가해보자.

```bash
$ kubectl label cm cm-csa key=value

configmap/cm-csa labeled
```

이렇게 추가된 `key: value` 라벨은 `kubectl apply` 로 제어되지 않는다.
이유는 이 라벨은 `kubectl apply` 을 통해 추가된 것이 아니여서 `kubectl.kubernetes.io/last-applied-configuration` 에 포함되어 있지 않기 때문이다.
정말 그런지 확인해보자.

```bash{9-10,12-13}
$ kubectl get cm cm-csa -o yaml    
                 
apiVersion: v1
data:
  key: value
kind: ConfigMap
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","data":{"key":"value"},"kind":"ConfigMap","metadata":{"annotations":{},"name":"cm-csa","namespace":"default"}}
  creationTimestamp: "2022-12-21T14:28:14Z"
  labels:
    key: value
  name: cm-csa
  namespace: default
  resourceVersion: "2194033"
  uid: 33084809-6b86-479e-95af-97d45e38daf6
```

`key: value` 라벨은 추가되었지만, `kubectl.kubernetes.io/last-applied-configuration` 내에 이 라벨은 추가되지 않았다.
이 때문에 이 라벨은 `kubectl apply` 를 통해 머지 패치가 진행될 때 삭제되지 않는다.

그럼 왜 이렇게 설계되어 있을까?
그 이유는 각 필드마다 그 필드를 관리하는 주체(Field Manager)가 다를 수 있기 때문이다.

예를 들어, `kubectl apply -f cm-csa.yaml` 은 데브옵스 팀에 의해서 실행되었고, `kubectl label cm cm-csa key=value` 는 서비스 팀에 의해서 실행되었다고 해보자.
만들어진 오브젝트에 대한 관리 주체는 기본적으로 데브옵스 팀이 되지만, `key: value` 라벨에 한해서는 서비스팀이 관리 주체가 된다는 것이다.

만약 오브젝트를 업데이트 하는 과정에서 머지 패치를 안하고 그냥 덮어쓴다면, 서비스팀이 만든 라벨은 갑자기 데브옵스 팀에 의해 사라지게 될 것이다.
이렇게 안되게 하기 위해 머지 패치 과정을 거치게 하는 것이고, `kubectl.kubernetes.io/last-applied-configuration` 를 이 과정 중에 사용하는 것이다.

다음처럼 `kubectl` 옵션 중 하나인 `--show-managed-fields` 를 사용하면 실제로 각 필드의 관리 주체가 누구인지 알 수 있다.

```bash{15-37}
$ kubectl get cm cm-csa -o yaml --show-managed-fields

apiVersion: v1
data:
  key: value
kind: ConfigMap
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","data":{"key":"value"},"kind":"ConfigMap","metadata":{"annotations":{},"name":"cm-csa","namespace":"default"}}
  creationTimestamp: "2022-12-21T14:28:14Z"
  labels:
    key: value
  managedFields:
  - apiVersion: v1
    fieldsType: FieldsV1
    fieldsV1:
      f:data:
        .: {}
        f:key: {}
      f:metadata:
        f:annotations:
          .: {}
          f:kubectl.kubernetes.io/last-applied-configuration: {}
    manager: kubectl-client-side-apply
    operation: Update
    time: "2022-12-21T14:28:14Z"
  - apiVersion: v1
    fieldsType: FieldsV1
    fieldsV1:
      f:metadata:
        f:labels:
          .: {}
          f:key: {}
    manager: kubectl-label
    operation: Update
    time: "2022-12-21T14:28:50Z"
  name: cm-csa
  namespace: default
  resourceVersion: "2194033"
  uid: 33084809-6b86-479e-95af-97d45e38daf6
```

`managedFields` 내에 다음처럼 2개의 `manager` 가 보인다.

- `kubectl-client-side-apply`
- `kubectl-label`

첫 번째의 경우 `kubectl apply` 로 인해 생긴 필드들을 관리하는 주체임을 알 수 있다.
두 번째의 경우는 `kubectl label` 로 인해 생긴 필드들을 관리하는 주체임을 알 수 있다.
이렇듯, 각 필드는 각자의 관리 주체를 가진다.

> 물론 위처럼 `kubectl apply` 이 아닌 배포 명령어들(`kubectl label`, `kubectl patch`, `kubectl edit` 등)을 쓰거나 혼용하는 것은 안티패턴이다.
> 여기서는 단지 예를 위해 위렇게 표현했다.
> 
> 그리고 보통 프로덕션 환경에서의 관리 주체는 위처럼 특정 팀이라기 보단 배포 도구나 Operator들이 되곤 한다.
> kubectl, helm, ArgoCD 등이 이 예시가 되겠다.

## CSA (Client Side Apply)

위에서 `kubectl apply` 로 인해 생긴 필드들의 관리 주체가 `kubectl-client-side-apply` 임을 알았다.
그런데 왜 `kubectl-apply` 가 아니라 `kubectl-client-side-apply` 일까? 
왜 `client-side` 란 용어가 들어가있을까?

이유는, 우리가 일반적으로 사용해온 `kubectl apply` 는 Client Side 옵션으로 실행되기 때문이다.
이는 다음처럼 `kubectl apply` 의 옵션을 살펴보면 알 수 있다.

```bash
$ kubectl apply --help

...
--field-manager='kubectl-client-side-apply':
        Name of the manager used to track field ownership.
...
--server-side=false:
        If true, apply runs in the server instead of the client.
...
```

기본적으로 `--server-side` 옵션의 값이 `false` 이기 때문에, 우리가 위에서 실행한 `kubectl apply` 를 좀 더 풀어쓰면 다음과 같다.

```bash
$ kubectl apply -f cm-csa.yaml --server-side=false
```

이처럼 우리가 일반적으로 사용하는 `kubectl apply` 는 `--server-side=false` 옵션이 붙어서 실행되며, 이렇게 실행하는 방식을 CSA(Client Side Apply)라 부른다.

CSA의 특징은 API 서버에게 요청을 보낼 때, 최종적으로 요청에 실을 Manifest를 클라이언트에서 모두 만들고 요청을 보낸다는 것이다.
즉 머지 패칭의 과정을 클라이언트(kubectl)에서 실행한다(`metadata.annotations` 에  `kubectl.kubernetes.io/last-applied-configuration` 를 붙이는 것도 [`kubectl` 이 한다](https://github.com/kubernetes/kubectl/blob/3e4add843df6081d9a679b6d70a24b01c307d2dd/pkg/cmd/apply/apply.go#L752)).
API 서버는 요청에 실려있는 Manifest를 패치(PATCH) 하기만 한다.

## CSA의 문제점

Client Side Apply를 쓰면 어떤 문제 상황이 생길 수 있을까?

위처럼 `kubectl label cm cm-csa key=value` 로 라벨을 추가한 상황에서 Manifest 파일을 다음처럼 수정한 뒤 배포한다고 해보자.

```yaml{7-8}
# cm-csa.yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-csa
  labels:
    key: modified-value
data:
  key: "value"
```

`key: modified-value` 라벨을 추가했다.
이 때, 기존의 라벨과 같은 `key` 임을 인지하자.

이제 다음처럼 배포해보자.

```bash
$ kubectl apply -f cm-csa.yaml

configmap/cm-csa configured
```

문제없이 잘 배포되었다.

라벨이 잘 추가되었는지 확인해보자.

```bash{11-12,18,32-33}
$ kubectl get cm cm-csa -o yaml --show-managed-fields
apiVersion: v1
data:
  key: value
kind: ConfigMap
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","data":{"key":"value"},"kind":"ConfigMap","metadata":{"annotations":{},"labels":{"key":"modified-value"},"name":"cm-csa","namespace":"default"}}
  creationTimestamp: "2022-12-21T15:05:49Z"
  labels:
    key: modified-value
  managedFields:
  - apiVersion: v1
    fieldsType: FieldsV1
    fieldsV1:
      f:metadata:
        f:labels: {}
    manager: kubectl-label
    operation: Update
    time: "2022-12-21T15:06:00Z"
  - apiVersion: v1
    fieldsType: FieldsV1
    fieldsV1:
      f:data:
        .: {}
        f:key: {}
      f:metadata:
        f:annotations:
          .: {}
          f:kubectl.kubernetes.io/last-applied-configuration: {}
        f:labels:
          f:key: {}
    manager: kubectl-client-side-apply
    operation: Update
    time: "2022-12-21T15:09:34Z"
  name: cm-csa
  namespace: default
  resourceVersion: "2197986"
  uid: 2f4c6231-c884-4302-a1e2-9cad271545d4
```

문제없이 잘 추가되었다. 
해당 라벨에 대한 `manager` 도 `kubectl-client-side-apply` 로 변경되었다.

자 그럼 이렇게 아무 문제없이 잘 변경된 것이 정말 문제가 없는 것일까?
`kubectl label` 로 라벨을 최초에 추가한 사람 입장에선 갑자기 자기가 추가한 라벨의 값이 누군가에 의해서 바뀌게 되었다. 
만약 이 과정 중 합의가 없었더라면, 이 사람에게는 꽤 짜증나는 상황이 될 것이다.

즉 지금의 문제는, 각 필드에 대한 관리 주체는 있으나 관리 주체가 아니더라도 누구나 필드를 수정하고 덮어쓸 수 있다는 것이다.

## SSA (Server Side Apply)

위 같은 문제를 느낀 일부 유저들은 필드의 관리 주체가 아닌 주체가 필드를 업데이트하려고 한다면, 이를 바로 업데이트 하지 못하도록 API 서버 단에서 막아야 한다고 생각했다.
결국 클라이언트인 `kubectl` 이 아니라, [서버인 API 서버에서 Apply 실행에 대한 머지 패칭이 진행되게끔 기능이 추가](https://github.com/kubernetes/enhancements/issues/555)되었고,
이 기능이 바로 [SSA(Server Side Apply)](https://kubernetes.io/docs/reference/using-api/server-side-apply/)다.

SSA를 사용하면 이제 더이상 `kubectl.kubernetes.io/last-applied-configuration` 를 사용하지 않는다.
오로지 `managedFields` 만을 사용하여 API 서버에서 머지 패칭을 진행하며, 필드의 관리 주체가 아닌 주체가 필드를 업데이트하려고 한다면 Conflict 메시지와 함께 업데이트가 진행되는 것을 막는다.

SSA 옵션을 한번 사용해보자.

위에서 만든 Configmap 오브젝트를 삭제하고 다시 다음처럼 Configmap Manifest를 준비한다.

```yaml
# cm-ssa.yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-ssa
data:
  key: "value"
```

이제 `kubectl apply` 로 배포할건데, 이 때 다음처럼 `--server-side` 옵션을 같이 준다.

```bash
$ kubectl apply -f cm-ssa.yaml --server-side

configmap/cm-ssa serverside-applied
```

만들어진 오브젝트를 확인해보자.

```bash{15}
$ kubectl get cm cm-ssa -o yaml --show-managed-fields

apiVersion: v1
data:
  key: value
kind: ConfigMap
metadata:
  creationTimestamp: "2022-12-22T15:08:14Z"
  managedFields:
  - apiVersion: v1
    fieldsType: FieldsV1
    fieldsV1:
      f:data:
        f:key: {}
    manager: kubectl
    operation: Apply
    time: "2022-12-22T15:08:14Z"
  name: cm-ssa
  namespace: default
  resourceVersion: "2263083"
  uid: f5485a89-a8a8-4d42-a948-39977f88042a
```

먼저 `kubectl.kubernetes.io/last-applied-configuration` 가 없는 것을 알 수 있다.
또한 `manager`가 `kubectl` 이 된 것을 볼 수 있다.
(CSA로 배포했을 때는 `manager` 가 `kubectl-client-side-apply` 였다.)

이제 다음처럼 오브젝트에 라벨 `key: value` 을 추가해본다.

```bash
$ kubectl label cm cm-ssa key=value

configmap/cm-ssa labeled
```

그리고 CSA의 문제 상황을 만든 것처럼 Manifest 파일을 다음처럼 수정하자.

```yaml{7-8}
# cm-ssa.yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-ssa
  labels:
    key: modified-value
data:
  key: "value"
```

아까와 같이 `kubectl apply` 에 `--server-side` 옵션을 주어 배포한다.

```bash
$ kubectl apply -f cm-ssa.yaml --server-side

error: Apply failed with 1 conflict: conflict with "kubectl-label" using v1: .metadata.labels.key
Please review the fields above--they currently have other managers. Here
are the ways you can resolve this warning:
* If you intend to manage all of these fields, please re-run the apply
  command with the `--force-conflicts` flag.
* If you do not intend to manage all of the fields, please edit your
  manifest to remove references to the fields that should keep their
  current managers.
* You may co-own fields by updating your manifest to match the existing
  value; in this case, you'll become the manager if the other manager(s)
  stop managing the field (remove it from their configuration).
See https://kubernetes.io/docs/reference/using-api/server-side-apply/#conflicts
```

이번엔 아까 CSA를 사용할 때와는 다르게 에러 메시지가 등장한다.
메시지를 해석해보면, `.metadata.labels.key` 값의 관리 주체는 `kubectl-label` 인데 지금 너(`kubectl`)랑 달라서 충돌이 나고, 업데이트를 할 수 없다는 것이다.

그리고 여기에 대한 대안 3가지를 다음처럼 말해준다.

1. 이렇게 덮어쓰는 걸 의도한게 맞다면, `--force-conflicts` 을 붙여서 기존 관리 주체를 무시하고 CSA처럼 그냥 덮어써라.
2. 의도한게 아니라면, Manifest 파일에서 관리 주체가 다른 필드(여기서는 `.metadata.labels.key`)를 빼라.
3. 해당 필드에 대한 관리 주체를 너(`kubectl`)를 포함시켜라. (이 경우, 기존 관리 주체가 해당 필드를 포기하면 필드 관리 권한은 나에게 넘어온다.)

사실상 현실적인 선택지는 1번과 2번인거 같다.
3번은 결국 관리 주체로 내가 포함되어도, 소유권은 여전히 기존 관리 주체에게 있기 때문에, 바로 해당 필드를 삭제하거나 업데이트할 수가 없기 때문이다.

## 그래서 SSA는 왜 쓰는가?

그럼 위에서 1을 선택하면 결과적으로는 CSA랑 별 차이를 모르겠는데, 그럼 대체 SSA는 CSA와 비교하여 무엇이 좋으며, 왜 써야하는걸까?

여러 사이트에서 의견을 찾아보고 정리하면 다음과 같다.

- CSA와 다르게 SSA는 Conflict을 내기 때문에, 실수로 기존 관리 주체를 그대로 덮어써버리는 실수를 줄일 수 있다.
- CSA는 (내가) 관리하지 않아도 되는 필드를 모두 적어줘야했지만, SSA는 (내가) 관리할 필드만 적어서 제출하면 된다.
- 복잡한 CR(Custom Resource)을 CSA로 쓰면 `kubectl.kubernetes.io/last-applied-configuration` 이 꽤 비대해지는데, 더 이상 이런 비대한 필드를 볼 일이 없고, etcd의 저장 공간을 아낄 수 있다.

개인적인 생각으로는 SSA는 한 오브젝트에 대해 여러 관리 주체가 수정을 시도할 때, CSA보다 조금 더 정밀하고 안전하게 시도할 수 있게끔 해주는게 가장 큰 장점인거 같다.

한편, 여러 관리 주체가 수정을 시도하는 환경이 아니라면(예를 들어 모든 `kubectl` 을 팀 내 한 사람만 쓴다든지, ArgoCD만을 이용하여 배포한다든지),
내 생각엔 굳이 SSA까지 써야하나 싶은 생각도 든다.

## `--dry-run=server`

한편 SSA를 쓰는 경우, 다음처럼 `--dry-run=client` (`--dry-run` 과 동일)은 쓸 수 없다.

```bash
$ kubectl apply -f cm-ssa.yaml --server-side --dry-run=client

error: --dry-run=client doesn't work with --server-side (did you mean --dry-run=server instead?)
```

상식적으로 생각해봐도 API 서버를 안거치는 `--dry-run=client` 와 API 서버를 거쳐야 하는 `--server-side` 는 같이 사용하는 것은 이상하며, 상충되는 일이다.
따라서 SSA를 쓰는 경우 `--dry-run` 을 사용하고 싶다면, 다음처럼 `--dry-run=server` 을 사용해야 한다.

```bash
$ kubectl apply -f cm-ssa.yaml --server-side --dry-run=server

configmap/cm-ssa serverside-applied (server dry run)
```

> 한편 CSA를 쓰면서 `--dry-run=server` 을 쓰는 것은 가능하다.
> 그럼 `--dry-run` 의 값으로 `client` 와 `server` 는 무슨 차이인가? 하면 `client` 는 요청이 API Server 내 Admission Controller를 거치지 않는 한편, 
> `server` 는 거친다. 따라서, `--dry-run` 으로 배포에 문제가 없는지 확인하고 싶다면 `server` 값을 사용하는게 맞고, 단순히 `-o yaml` 옵션과 함께
> YAML 스펙만 확보하고 싶다면 `client` 옵션만 써도 무방하다.
> 이에 대한 자세한 내용이 궁금하다면 [이 블로그 글](https://nunoadrego.com/posts/kubectl-dry-run/)을 참고하면 좋을거 같다.

## 정리

지금까지 작성한 내용을 요약, 정리하면 다음과 같다.

- kubectl은 초기에 CSA만 지원했고, CSA를 사용하면 kubectl은 오브젝트 업데이트에 `kubectl.kubernetes.io/last-applied-configuration` 필드를 머지 패칭에 활용했다.
- 그러나 이는 한 필드에 대해 여러 관리 주체가 있는 경우, Conflict 없이 쉽게 기존 값을 덮어써서 문제가 될 수 있었다.
- kubectl에 SSA가 등장했고, SSA를 사용하면 `kubectl.kubernetes.io/last-applied-configuration` 은 사용되지 않고, kubectl이 아닌 API 서버가 머지 패칭을 진행한다.
- 필드에 기존과 다른 관리 주체가 업데이트를 시도하면 Conflict 에러가 나고 업데이트를 진행시키지 않는다. 따라서 더 안전하게 업데이트(Apply)를 진행할 수 있다.

> 잘못되거나 틀린 내용이 있을 수 있습니다.
> 이러한 부분은 댓글로 말씀해주시면 정말 감사하겠습니다.

## 참고

- https://kubernetes.io/docs/reference/using-api/server-side-apply/
- https://kubernetes.io/blog/2022/10/20/advanced-server-side-apply/
- https://kubernetes.io/blog/2022/11/04/live-and-let-live-with-kluctl-and-ssa/
- https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/555-server-side-apply/README.md
- https://argo-cd.readthedocs.io/en/latest/proposals/server-side-apply/#motivation
- https://www.youtube.com/watch?v=P12z8X-qhis&ab_channel=AquaSecurityOpenSource
- https://nunoadrego.com/posts/kubectl-dry-run/
