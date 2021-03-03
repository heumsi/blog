 # Poetry 에서 로컬 패키지 add 하기



### 배경

`poetry` 를 쓰면 일반적으로 `add` 명령어로 패키지를 가상 환경에 추가한다.  
예를 들어 `pandas` 를 추가하고 싶으면 다음처럼 하면 된다.

```bash
$ poetry add pandas
```

대부분의 경우 이렇게 [pypi](https://pypi.org/) 에 등록된 패키지를 설치하곤 한다.
그런데 만약 pypi에 등록되지 않은 로컬 패키지를 add 하고 싶은 경우라면 어떨까?  

예를 들어 프로젝트 패키지 구조가 다음처럼 되어 있다고 하자.

```
my-project
├── dependencies
│   └── my-sub-package
│       ├── README.rst
│       ├── my_sub_package
│       │   ├── __init__.py
│       │   └── my_func.py
│       └── pyproject.toml
└── pyproject.toml
```

`my-project` 라는 프로젝트 패키지 안에 `my-sub-package` 있고, `my-project` 에서 이 `my-sub-package` 를 `poetry add` 하여 사용하고 싶은 경우에 어떻게 해야할까?

참고로 위 파일들의 내용은 다음처럼 구성되어 있다.

```toml
# my-project/pyproject.toml

[tool.poetry]
name = "my-project"
version = "0.1.0"
description = ""
authors = ["heumsi <heumsi@naver.com>"]

[tool.poetry.dependencies]
python = "^3.8"

[tool.poetry.dev-dependencies]

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

```toml
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

```python
# my-project/dependencies/my-sub-package/my_sub_package/my_func.py

def hello():
    print("hello!")
```



### 해결 방법

`my-project/pyproject.toml` 내 `[tool.poetry.dependencies]` 에 로컬 패키지를 다음처럼 추가한다.

```toml
[tool.poetry.dependencies]
my-sub-package = { path = "dependencies/my-sub-package" }
```

기존 패키지 추가랑 다른 점은 `{ path = (로컬 패키지 경로) }` 가 들어갔다는 점이다.
이후 `my-project/` 경로에서  `poetry install` 을 해주면 다음처럼 잘 설치된다.

```bash
$ poetry install 
Creating virtualenv my-project in my-project/.venv
Installing dependencies from lock file
Package operations: 1 install, 0 updates, 0 removals
  • Installing my-sub-package (0.1.0 my-project/dependencies/my-sub-package)
```

이제 가상 환경에 들어가 실제로 잘 설치되었는지 확인해보자

```bash
# 가상 환경 진입
$ poetry shell
spawning shell within my-project/.venv

# 파이썬 실행
$ (venv) python
Python 3.8.5 (default, Sep  7 2020, 12:14:06)
[Clang 11.0.3 (clang-1103.0.32.62)] on darwin
Type "help", "copyright", "credits" or "license" for more information.

>>> from my_sub_package import my_func
>>> my_func.hello()
hello!
```

가상 환경에 패키지가 잘 설치된 것을 확인했다!



### 팁

만약 위와 같은 용도로 로컬 패키지를 새로 만드는 경우라면 `poetry new {패키지 이름} ` 명령어를 쓰면 기본 패키지 구성을 만들어준다.  
예를 들어 `my-sub-package` 를 만들려면 다음처럼 하면 된다.

```bash
$ poetry new my-sub-package
Created package my_sub_package in my-sub-package

$ tree .
.
└── my-sub-package
    ├── README.rst
    ├── my_sub_package
    │   └── __init__.py
    ├── pyproject.toml
    └── tests
        ├── __init__.py
        └── test_my_sub_package.py
```

