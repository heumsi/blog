### 배경

어떤 파이썬 패키지들을 설치한 뒤 터미널에서 특정 명령어로 바로 실행가능한 경우가 있다.  
예를 들면 다음과 같다.

```bash
# 다음 처럼 패키지를 설치한 뒤
$ poetry add pytest  # pip install pytest 로 해도 상관없다.

# 다음 처럼 바로 실행 가능하다.
$ pytest
```

이렇게 설치 후 터미널에서 특정 명령어로 바로 실행가능한 poetry 패키지를 만들려면 어떻게 해야할까?



### 해결 방법

poetry 프로젝트 내에 있는 `pyproject.toml` 의 `[tool.poetry.scripts]` 를 활용하면 된다.  

간단한 예제로 직접 확인해보자.  
이전 포스트 ["Poetry 에서 로컬 패키지 add 하기"](https://dailyheumsi.tistory.com/251) 의 예제를 그대로 이어서 사용해본다.  
프로젝트 구조는 다음과 같다.

```bash
my-project
├── dependencies
│   └── my-sub-package
│       ├── README.rst
│       ├── my_sub_package
│       │   ├── __init__.py
│       │   └── my_func.py
│       └── pyproject.toml
└── pyproject.toml
```

파일 내용은 다음과 같다.

```
# my-project/pyproject.toml

[tool.poetry]
name = "my-project"
version = "0.1.0"
description = ""
authors = ["heumsi <heumsi@naver.com>"]

[tool.poetry.dependencies]
python = "^3.8"
my-sub-package = { path = "dependencies/my-sub-package" }

[tool.poetry.dev-dependencies]

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

```
# my-project/dependencies/my-sub-package/pyproject.toml

[tool.poetry]
name = "my-sub-package"
version = "0.1.0"
description = ""
authors = ["heumsi <heumsi@naver.com>"]

[tool.poetry.dependencies]
python = "^3.8"

[tool.poetry.dev-dependencies]
pytest = "^5.2"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

```
# my-project/dependencies/my-sub-package/my_sub_package/my_func.py

def hello():
    print("hello!")
```



이제 `[tool.poetry.scripts]` 를 활용하여 기존의 `pyproject.toml` 을 수정해보자.  
`my-project/dependencies/my-sub-package/pyproject.toml` 를 다음과 같이 수정한다.

```
[tool.poetry]
name = "my-sub-package"
version = "0.2.0"  # 0.1.0 -> 0.2.0 으로 수정
description = ""
authors = ["heumsi <heumsi@naver.com>"]

[tool.poetry.dependencies]
python = "^3.8"

[tool.poetry.dev-dependencies]
pytest = "^5.2"

[tool.poetry.scripts]  # 이 두 줄이 추가되었다.
my_command = "my_sub_package.my_func:hello"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

수정한 부분에 대한 설명을 하나씩 해보면

```
[tool.poetry]
...
version = "0.2.0"  # 0.1.0 -> 0.2.0 으로 수정
```

패키지의 `pyproject.toml` 에 수정된 부분이 생겨서 패키지의 마이너 버전을 하나 업데이트 하였다.

```
[tool.poetry.scripts]
my_command = "my_sub_package.my_func:hello"
```

`my_command` 라는 명령어를 터미널에서 실행 시, 패키지 내 `my_sub_package.my_func` 모듈에 있는 `hello` 함수를 실행하겠다는 의미다.  
`my_sub_package.my_func` 는 패키지 루트 경로를 기준으로 잡힌 것이다.  
`hello` 는 위에서 함수로 구현되어 있는데, `Callable` 한 객체이기만 하면 된다.

이제 `my-project/` 경로에 가서 다음처럼 `my-sub-package` 패키지를 재 빌드 & 설치해보자.

```bash
$ poetry install
Installing dependencies from lock file

Package operations: 0 installs, 1 update, 0 removals
 • Updating my-sub-package (0.1.0 -> 0.2.0) 
```

이제 가상환경에 진입한 후 다음 명령어로 `[tool.poetry.scripts] ` 에서 정의한 명령어를 실행해보자.

```
$ poetry shell
$ (venv) my_command
hello!
```

잘 작동하는 것을 알 수 있다!

