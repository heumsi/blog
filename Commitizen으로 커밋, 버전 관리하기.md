## 들어가며

개발을 하며 Git을 잘 활용하려고 하다보면 이래저래 신경쓸게 많다. 그 중에서도 특히 **커밋 메시지 규칙**과 **버저닝 규칙**은 초반부터 잘 잡아놓으면 좋은 부분인데, 사실 규칙을 세우고 잘 지켜나가기가 쉽지 않다. 어떤 규칙을 세우고 팀원들에게 지켜달라고 해도, 실수는 늘 있기 마련이고, 중간에 이를 잡아주는 사람이 없으면 규칙은 언제든 무너지게 된다.

이번 글에서 소개할 commitizen은 이런 규칙을 잘 잡아주고 지켜나가도록 도와주는 python 라이브러리다.   
GitHub에서 오픈소스를 본 적이 있다면 `CHANGELOG.md` 나 섬세하게 버저닝이 된 태그들도 같이 보았을 것이다. 이런 것들을 모두 `commitizen` 으로 구현할 수 있다.

![image-20210520220546043](/Users/hardy/Documents/blog/images/image-20210520220546043.png)

commitizen을 사용하게 되면 더 이상 `git commit` 명령어를 사용하지 않는다. 대신 `cz c` 명령어로 커밋을 찍게된다. 또한 명시적 버전 관리를 위해 직접 `v0.1.0` 과 같은 태그를 일일이 달아주지 않아도 된다. `cz bump` 명령어를 통해 규칙에 맞게 자동으로 버저닝 해준다.

이제 commitizen이 무엇인지 얼핏 알았으니, 본격적으로 사용하는 방법을 알아보자.



> **커밋 메시지 규칙과 버저닝에 대해 처음 듣는다면...**
>
> 커밋 메시지 규칙에 대해 구글링해보면 여러 자료가 나온다. 보통 이런 규칙은 개발 팀따라 다르지만, 일반적으로 유명한 몇가지  규칙들도 있다. 이 글에서는 커밋 메시지 규칙으로 Conventional Commit을 사용한다. 또한 버저닝은 Semantic Versioning을 사용한다. 둘 다 오픈소스에서 일반적으로 사용하는 방법으로, 잘 모른다면 아래 내용을 먼저 읽어보자.
>
> - [spoqa 블로그 - Semantic Versioning 소개](https://spoqa.github.io/2012/12/18/semantic-versioning.html)
> - [Conventional Commits 한글 문서](https://www.conventionalcommits.org/ko/v1.0.0-beta.4/)



## 사전 준비

> 아래 진행사항을 제대로 이해하기 위해서는 pyenv와 poetry에 대한 내용을 먼저 알아야한다.  
>혹 이 둘을 잘 모른다면 이전에 썼던 글을 확인하자.
> 
> - [나의 파이썬 환경 구축기 1 - 써본 것들에 대한 생각](https://dailyheumsi.tistory.com/243?category=799302)
>- [나의 파이썬 환경 구축기 2 - pyenv + poetry](https://dailyheumsi.tistory.com/244?category=799302)

- git 설치 (나는 2.29.0 버전을 사용 중이다)
- python 3.8 (나는 3.8.7을 사용했다)
- 가상환경 (나는 poetry를 사용했다)

```bash
# 프로젝트 디렉토리 생성 및 깃 초기화
$ mkdir commitizen-playground
$ cd commitizen-playground
$ git init

# 파이썬 3.8.7 사용
$ pyenv shell 3.8.7

# 파이썬 프로젝트 초기화
$ poetry init  # 모두 기본 값으로 하되, version만 0.0.1로 입력해주자.

# 가상환경 세팅 및 접속
$ poetry env use 3.8.7
$ poetry shell
```



## 설치

```bash
# commitizen은 개발할 때만 사용되므로 개발용 패키지로 설치한다.
$ poetry add commitizen -D

# 버전 확인 (commitizen은 cz 명령어로 실행한다)
$ cz version
2.17.6
```



## 커밋 찍기

이제 commitizen으로 커밋을 찍어보자.  
현재 디렉토리에 생성된 파일들을 커밋해본다. 커밋은 `git commit` 이 아니라 `cz c` 를 이용한다. (`cz commit` 도 된다.)

```bash
$ git add .
$ cz c
```

![image-20210520230944854](/Users/hardy/Documents/blog/images/image-20210520230944854.png)

첫 화면에 커밋의 타입(fix, feat, docs 등)을 선택하라는 안내가 뜬다. 여기서 우리는 빌드와 관련된 파일들(`poetry.lock`, `pyproject.toml`)을 추가했으므로 `build` 타입을 선택한 뒤 엔터를 친다.

![image-20210520231157697](/Users/hardy/Documents/blog/images//image-20210520231157697.png)

다음으로 변경된 파일의 스코프를 입력하라고 나온다. 만약 내가 `git add pyproject.toml` 과 같이 단일 파일을 깃에 추가했다면 여기서 `pyproject.toml` 이라고 입력하면 된다. 이러면 나중에 커밋 메시지가 `build(pyproject.toml): 커밋 메시지` 과 같이 생성된다. 여기서는 일단 그냥 공백으로 넘어가자.

![image-20210520231430181](/Users/hardy/Documents/blog/images/image-20210520231430181.png) 

다음에 커밋 메시지를 간단히 요약한 내용을 적어달라고 한다. 커밋 메시지 제목에 들어가는 부분이라고 보면 된다. ` 프로젝트 빌드와 관련된 파일들을 추가한다` 라고 적어주자.

이후에 추가적인 몇 개의 질문들이 더 나오는데, 일단은 그냥 모두 기본 값(내용을 채우지 않고 그냥 공백)으로 입력하고 넘어간다.

![image-20210520231637510](/Users/hardy/Documents/blog/images/image-20210520231637510.png)

그러면 최종적으로 `build: 프로젝트 빌드와 관련된 파일들을 추가한다` 이라는 커밋 로그가 남게된다.  
이는 `git log` 에서 확인할 수 있다.

![image-20210520231818920](/Users/hardy/Documents/blog/images//image-20210520231818920.png)



## pre-commit hook에 적용하기

위 처럼 `cz c` 명령어를 사용하면 모든 커밋 메시지를 Conventional Commit 규칙에 맞게 작성할 수 있다. 그러나 여전히 `git commit` 도 동작하며, 개발 팀 내 누군가는 `git commit` 으로 커밋 메시지를 작성할 수 있다. 이 과정에서 Conventional Commit 규칙이 지켜지지 않은 커밋 메시지가 기록될 수 있다. 따라서 이렇게 규칙을 지키지 않는 커밋 메시지를 통제할 필요가 있는데, 이 때 사용될 수 있는 방법이 pre-commit hook을 사용하는 방법이다.

pre-commit hook은 `git commit` 실행 시, 최종적으로 커밋 메시지를 찍기 전에 실행되는 hook으로 일반적인 git 활용 방법이다. 보통 이 hook에 린팅, 포매팅 등 여러가지 작업을 여기에 걸어두곤 한다. 파이썬에서는 pre-commit hook은 pre-commit 패키지를 통해 쉽게 구현할 수 있다. 이에 대한 자세한 내용은 ["daleseo님 블로그 - pre-commit 도구로 Git Hook 사용하기"](https://www.daleseo.com/pre-commit/)을 참고하자.

commitizen도 이 pre-commit-hook을 지원한다. 이제 hook에 commitizen을 적용하는 방법을 알아보자.  
먼저 `pre-commit` 패키지를 설치한다.

```bash
$ poetry add pre-commit -D
```

이제 `.pre-commit` 의 훅을 정의하는 파일인 `.pre-commit-config.yaml` 을 다음처럼 작성한다.

```yaml
# .pre-commit-config.yaml

repos:
  - repo: https://github.com/commitizen-tools/commitizen
    rev: master
    hooks:
      - id: commitizen
        stages: [commit-msg]
```

작성 후 다음 명령어를 실행하여 위 설정 파일을 등록한다.

```bash
$ pre-commit install --hook-type commit-msg
```

이제 실제로 잘 작동하는지 확인해보자.  
다음처럼 간단한 파일을 만든 뒤, `git commit` 으로 Conventional Commit 규칙을 어기는 커밋 메시지를 작성해본다.

```bash
# 간단한 파일 생성
$ touch a

# git에 추가하고 커밋을 찍음
$ git add a
$ git commit -m "Conventional Commit 규칙을 어기는 메시지"
```

![image-20210520235522083](/Users/hardy/Documents/blog/images/image-20210520235522083.png)

실행 결과 위처럼 `Failed` 결과를 내며 제대로 커밋을 찍지 않는다. 이유는 커밋 메시지가 Conventional Commit 형태가 아니기 때문이다. 이번에는 Conventional Commit 규칙을 지켜 다시 커밋을 찍어보자.

![image-20210520235703665](/Users/hardy/Documents/blog/images/image-20210520235703665.png)

이번에는 `Passed` 결과를 내며 커밋이 잘 찍힌 것을 볼 수 있다.  
이렇게 `pre-commit` 을 이용하면 커밋으로 찍히는 모든 메시지가 규칙을 지키는지 확인하고 통제할 수 있다. 



## bump 하기

bump는 지금까지 작업한 코드를 릴리즈하고, 이 릴리즈에 버전을 매기는 작업을 말한다.  
구체적으로는 다음 작업을 실행한다.

- 이전 버전에서 새로운 버전으로 업데이트한다는 커밋을 찍고, 이 커밋에 버전이 적힌 태그를 붙인다.
- 이전 버전에서 새로운 버전 사이에 생긴 커밋들을 명시한 `CHANGELOG.md` 를 생성한다.

사실 이렇게만 말해서는 뭐하는건지 잘 와닿지 않는데, 바로 실습을 통해 알아보자.

먼저 `git log` 로 현재 어떤 커밋들이 찍혀있는지 보자.

![image-20210522151307920](/Users/hardy/Documents/blog/images//image-20210522151307920.png)

현재 어떤 태그도 달려있지 않다. 이제 여기에 버전이 달려있는 태그를 달 것이다.

`pyproject.toml` 를 열어 `commitizen` 관련 설정을 추가해주자.

```toml
# pyproject.toml

[tool.commitizen]
name = "cz_conventional_commits"
version = "0.0.1"
version_files = [
    "pyproject.toml:version"
]
tag_format = "v$version"
update_changelog_on_bump = true
```

![image-20210522151937223](/Users/hardy/Documents/blog/images/image-20210522151937223.png)

설정 값이 무엇을 의미하는지는 아래 명령어를 실행시키고 나면 이해가 갈 것이다.  
이제 다음 명령어를 실행한다.

```bash
$ cz bump
```

![image-20210522152041651](/Users/hardy/Documents/blog/images//image-20210522152041651.png)

`Is this the first tag created?` 질문에는 `Y` 값을 주면된다.  
이렇게 실행하고 다시 `git log` 를 실행해보자

 ![image-20210522152136261](/Users/hardy/Documents/blog/images/image-20210522152136261.png)

버전을 업데이트한다는 커밋과 이 커잇에 `v0.1.0` 태그가 달려있는 것을 확인할 수 있다.  
또 `ls -al` 명령어를 쳐보면 `CHANGELOG.md` 라는 파일이 생겨있는 것을 볼 수 있다.

![image-20210522152252277](/Users/hardy/Documents/blog/images//image-20210522152252277.png)

이 `CHANGELOG.md` 파일을 열어보면 다음처럼 생겼다.

![image-20210522152343390](/Users/hardy/Documents/blog/images/image-20210522152343390.png)

`cz bump` 하기 전의 커밋들을 타입 별로 묶어서 보여주는 문서다. `CHANHELOG` 라는 말 그대로 변경(커밋)에 대한 내역을 한 눈에 볼 수 있는 문서인 셈이다.

한 번 더 해보자. 이번에는 간단하게 `b` 라는 파일을 만들고 `fix` 타입의 커밋을 찍어본다.

![image-20210522152659304](/Users/hardy/Documents/blog/images//image-20210522152659304.png)

이번에도 `cz bump` 를 실행해보자.

![image-20210522152731166](/Users/hardy/Documents/blog/images/image-20210522152731166.png)

`git log` 로 커밋을 확인해보면 다음처럼 `v0.1.1` 태그가 생긴 것을 볼 수 있다.  
`fix` 커밋을 찍었기 때문에 PATCH 버전이 올라갔다.

![image-20210522152757608](/Users/hardy/Documents/blog/images//image-20210522152757608.png)

`CHANGELOG.md` 에는 다음처럼 이번 버전에 대한 내용이 추가된다.

![image-20210522152839909](/Users/hardy/Documents/blog/images/image-20210522152839909.png)



## GItHub Action으로 Bump 자동화 하기

위의 경우 `cz bump` 를 작업을 완료한 사람이 직접 실행해야 한다. 번거롭기도 하고, 누구나 쉽게 버전을 올려버릴 수 있으므로 협업할 때는 다소 위험하기도 하다. 

이번에는 GitHub Aciton으로 이 `bump` 작업을 자동화 해보자.  
구체적으론 다음 작업을 한다.

- `master` 브랜치에 `push` 될 때에만 `bump`가 작동한다.
- GitHub Release 에 자동으로 버전을 등록하고, `CHANGELOG.md` 내용을 릴리즈 내용에 담는다.

이제 실습해보자. 먼저 개인용 Access Token을 만든다. 이미 있는 사람은 만들어둔거 쓰면 된다.
Access Token은 Github에 로그인 후 Settings / Developer settings / Personal access tokens에서 만들 수 있다.

![image-20210522154027285](/Users/hardy/Documents/blog/images/image-20210522154027285.png)

나는 `GitHub Actions` 라는 이름을 주었고, scopes는 `workflow` 를 하나 선택했다.  
이렇게 토큰을 만든 뒤, GitHub Repo에 Secret을 추가한다.  
Secret은 Repository의 Settings / Secrets 에서 추가할 수 있다.

> 여기서 GitHub Repository를 만들고 로컬에 만든 코드를 Push 하는 것은 간단한 일이라 다루지는 않았다.  
> 만약 따라하는 사람이 있다면, GitHub Repository를 만들고, 기존 코드와 태그를 올리는 작업을 먼저 선행하자.

![image-20210522154628932](/Users/hardy/Documents/blog/images//image-20210522154628932.png)

나는 `PERSONAL_ACCESS_TOKEN` 이라는 이름으로 추가하였다.

이제 GitHub Action을 사용하는 파일을 작성하자. `.github/workflows` 에 `dumpversion.yaml` 을 다음처럼 작성한다.

```yaml
# .github/workflows/dumpversion.yaml

name: Bump version

on:
  push:
    branches:
      - master

jobs:
  bump-version:
    if: "!startsWith(github.event.head_commit.message, 'bump:')"
    runs-on: ubuntu-latest
    name: "Bump version and create changelog with commitizen"
    steps:
      - name: Check out
        uses: actions/checkout@v2
        with:
          token: "${{ secrets.PERSONAL_ACCESS_TOKEN }}"
          fetch-depth: 0
      - name: Create bump and changelog
        uses: commitizen-tools/commitizen-action@master
        with:
          branch: master
          github_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          changelog_increment_filename: body.md
      - name: Release
        uses: softprops/action-gh-release@v1
        with:
          body_path: "body.md"
          tag_name: v${{ env.REVISION }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

커밋을 찍고 푸시하자. (마이너 버전 업데이트를 하기 위해 일부러 `feat` 타입의 커밋을 선택했다)

![image-20210522161805845](/Users/hardy/Documents/blog/images/image-20210522161805845.png)

이제 GitHub Repository에서 Actions 탭에 들어가보면 다음처럼 Action 파이프라인이 실행된 것을 볼 수 있다.

![image-20210522161423730](/Users/hardy/Documents/blog/images//image-20210522161423730.png)

파이프라인을 클릭 후 좀만 기다리면 다음처럼 `Success` 표시가 뜬다.

![image-20210522161531648](/Users/hardy/Documents/blog/images/image-20210522161531648.png)

이제 GitHub Repository에서 Code 탭에 가보면 다음처럼 GitHub Action이 생성한 커밋과 Release가 생긴 것을 볼 수 있다.

![image-20210522163923977](/Users/hardy/Documents/blog/images//image-20210522163923977.png)

Release를 눌러보면 다음처럼 `CHANGELOG.md` 에 추가된 내용이 있는 것을 볼 수 있다.

![image-20210522163955045](/Users/hardy/Documents/blog/images/image-20210522163955045.png)



## 정리

- commitizen을 통해서 conventional commit 형태로 커밋을 운영할 수 있다.
- 또한 tag와 release도 자동화할 수 있다.

지속적으로 개발 및 유지보수해야하는 프로젝트에 이런 툴은 필수적으로 사용되어야 되지 않을까 싶다. 특히 프로젝트 환경 세팅할 때 한번 같이 설정해두면 이후 커밋과 버저닝에 대한 고민은 좀 덜해도 되서 매우 편리할 거 같다.

위에서 작업한 내용은 [여기서](https://github.com/heumsi/commitizen-playground) 확인할 수 있다.