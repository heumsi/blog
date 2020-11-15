저번 글에 지금까지 써본 것들에 대한 생각을 주저리 주저리 적었고...  
이제 내가 현재 사용하는 파이썬 환경 구축 방법에 대해 본격적으로 이야기해보려 한다.

## 콘다를 쓰고있었다면..? 지우자

내가 제일 처음 한 일은 내 맥북에 깔린 아나콘다를 지우는 것이었다.  
이 지긋한 콘다 이제는 보내주자.  
[공홈에 지우는 방법](https://docs.anaconda.com/anaconda/install/uninstall/)이 설명되어있다. 순서만 간략히 적으면 다음과 같다.

1.  `conda install anaconda-clean` 로 `anaconda-clean` 설치
2.  설치 후 `anaconda-clean --yes` 실행
3.  `~/bash-profile` 혹은 `~/zshrc` 에서 `export PATH="/Users/{user_name}/anaconda3/bin:$PATH"` 삭제 후 저장
4.  `rm -rf ~/anaconda3` 실행
5.  `rm -rf ~/.anaconda_backup/` 실행

끝. 안녕 콘다.

## pyenv로 파이썬 설치하기

다음처럼 `brew` 로 pyenv를 설치해준다.

```bash
$ brew install pyenv
```

설치가 완료되었으면 다음 스크립트를 쉘 profile에 추가하자.  
`bash` 를 사용하면 `~/.zshrc` 을 `~/.bash_profile` 로 바꿔주면 된다.

```bash
$ echo -e '\nif command -v pyenv 1>/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi' >> ~/.zshrc

$ source ~/.zshrc
```

여기까지 완료가 되었으면, 다음 명령어로 install 가능한 파이썬 목록을 볼 수 있다.

```bash
$ pyenv install --list
Available versions:
  2.1.3
  2.2.3
  2.3.7
  2.4.0
  2.4.1
  2.4.2
  2.4.3
  2.4.4
  ...
```

다음과 같이 특정 파이썬 버전을 설치할 수 있다.  
나는 `3.7.8` 과 `3.9.0` 두 개를 설치했다.

```bash
$ pyenv install 3.7.8
$ pyenv install 3.9.0
```

다음과 같이 현재 설치된 파이썬 버전을 볼 수 있다.

```bash
$ pyenv versions
system
3.7.8
3.9.0
```

다음 명령어로 global 파이썬 인터프리터를 설정할 수 있다.

```bash
$ pyenv global 3.9.0
```

다음 명령어로 현재 사용 중인 파이썬 버전을 볼 수 있다.

```bash
$ pyenv version
3.9.0 (set by /Users/heumsi/.pyenv/version)
```

그 밖에 pyenv 관련 명령어는 다음과 같은 것들이 있다.

```bash
$ pyenv --help
pyenv 1.2.21
Usage: pyenv <command> [<args>]

Some useful pyenv commands are:
   --version   Display the version of pyenv
   activate    Activate virtual environment
   commands    List all available pyenv commands
   deactivate   Deactivate virtual environment
   exec        Run an executable with the selected Python version
   global      Set or show the global Python version(s)
   help        Display help for a command
   hooks       List hook scripts for a given pyenv command
   init        Configure the shell environment for pyenv
   install     Install a Python version using python-build
   local       Set or show the local application-specific Python version(s)
   prefix      Display prefix for a Python version
   rehash      Rehash pyenv shims (run this after installing executables)
   root        Display the root directory where versions and shims are kept
   shell       Set or show the shell-specific Python version
   shims       List existing pyenv shims
   uninstall   Uninstall a specific Python version
   version     Show the current Python version(s) and its origin
   version-file   Detect the file that sets the current pyenv version
   version-name   Show the current Python version
   version-origin   Explain how the current Python version is set
   versions    List all Python versions available to pyenv
   virtualenv   Create a Python virtualenv using the pyenv-virtualenv plugin
   virtualenv-delete   Uninstall a specific Python virtualenv
   virtualenv-init   Configure the shell environment for pyenv-virtualenv
   virtualenv-prefix   Display real_prefix for a Python virtualenv version
   virtualenvs   List all Python virtualenvs found in `$PYENV_ROOT/versions/*'.
   whence      List all Python versions that contain the given executable
   which       Display the full path to an executable
```

더 자세한 사항은 공식 [GitHub Readme](https://github.com/pyenv/pyenv) 를 읽어보면 된다.

## poetry로 가상 환경과 패키지 매니징 하기

### 설치

파이썬을 설치했으니, 이제 가상 환경 생성과 파이썬 패키지 매니징을 담당할 poetry를 설치해보자.  
터미널 열고 아래 명령어 하나씩 입력하면 된다.

```bash
# Install poetry via curl
$ curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python

# Add poetry to your shell path
$ echo -e 'export PATH="$HOME/.poetry/bin:$PATH"' >> ~/.zshrc
# bash 사용하는 사람은 >> ~/.bash_profile 로 하면 됨.

# Configure poetry to create virtual environments inside the project's root directory
poetry config virtualenvs.in-project true
```

`poetry tab completion` 은 shell에서 `poetry` 를 입력하고 tab을 누르면 명령어 목록이 뜨는 기능이다.  
나의 경우 `oh-my-zsh` 를 쓰기 때문에 다음 명령어를 주었다.  
다른 셸을 쓰는 사람은 [이 링크](https://github.com/python-poetry/poetry#enable-tab-completion-for-bash-fish-or-zsh) 참고하자.

```bash
$ mkdir $ZSH_CUSTOM/plugins/poetry
$ poetry completions zsh > $ZSH_CUSTOM/plugins/poetry/_poetry
```

완료했으면 `source ~/.zshrc` 로 셀을 재실행 하자.  
이제 터미널에서 `poetry` 만 치고 탭을 누르면 다음과 같이 쭈욱 실행 가능한 명령어가 등장한다.

```bash
$ poetry 
about    -- Shows information about Poetry.
add      -- Adds a new dependency to pyproject.toml.
build    -- Builds a package, as a tarball and a wheel by default.
cache    -- Interact with Poetry's cache
check    -- Checks the validity of the pyproject.toml file.
config   -- Manages configuration settings.
debug    -- Debug various elements of Poetry.
env      -- Interact with Poetry's project environments.
export   -- Exports the lock file to alternative formats.
help     -- Display the manual of a command
init     -- Creates a basic pyproject.toml file in the current directory.
install  -- Installs the project dependencies.
lock     -- Locks the project dependencies.
new      -- Creates a new Python project at <path>.
publish  -- Publishes a package to a remote repository.
remove   -- Removes a package from the project dependencies.
run      -- Runs a command in the appropriate environment.
search   -- Searches for packages on remote repositories.
self     -- Interact with Poetry directly.
shell    -- Spawns a shell within the virtual environment.
show     -- Shows information about packages.
update   -- Update the dependencies as according to the pyproject.toml file.
version  -- Shows the version of the project or bumps it when a valid bump rule is provided.
```

### 초기화

poetry를 이제 실제로 한번 써보자.  
다음처럼 파이썬 프로젝트로 사용할 디렉토리를 하나 만든 뒤, 들어간다.

```bash
$ mkdir my-python-project
$ cd my-python-project
```

먼저 poetry를 init 한다.  
이것저것 입력하는 부분이 쭈욱 나올 텐데, 일단 엔터만 눌러 기본 값으로 채워주자.

```bash
$ poetry init

This command will guide you through creating your pyproject.toml config.

Package name [my-python-project]:
Version [0.1.0]:
Description []:
Author [heumsi <heumsi@gmail.com>, n to skip]:
License []:
Compatible Python versions [^3.9]:

Would you like to define your main dependencies interactively? (yes/no) [yes]
You can specify a package in the following forms:
  - A single name (requests)
  - A name and a constraint (requests@^2.23.0)
  - A git url (git+https://github.com/python-poetry/poetry.git)
  - A git url with a revision (git+https://github.com/python-poetry/poetry.git#develop)
  - A file path (../my-package/my-package.whl)
  - A directory (../my-package/)
  - A url (https://example.com/packages/my-package-0.1.0.tar.gz)

Search for package to add (or leave blank to continue):

Would you like to define your development dependencies interactively? (yes/no) [yes]
Search for package to add (or leave blank to continue):

Generated file

[tool.poetry]
name = "my-python-project"
version = "0.1.0"
description = ""
authors = ["heumsi <heumsi@gmail.com>"]

[tool.poetry.dependencies]
python = "^3.9"

[tool.poetry.dev-dependencies]

[build-system]
requires = ["poetry>=0.12"]
build-backend = "poetry.masonry.api"


Do you confirm generation? (yes/no) [yes]
```

이렇게 init 하고 나면, `pyproject.toml` 라는 파일이 하나 생긴다.  
내용을 보면, 방금 init 명령어로 입력한 (여기서는 기본 값 그대로 사용했지만...) 정보들이 나와 있다.

```bash
$ ls
pyproject.toml

$ cat pyproject.toml
[tool.poetry]
name = "my-python-project"
version = "0.1.0"
description = ""
authors = ["heumsi <heumsi@gmail.com>"]

[tool.poetry.dependencies]
python = "^3.9"

[tool.poetry.dev-dependencies]

[build-system]
requires = ["poetry>=0.12"]
build-backend = "poetry.masonry.api"
```

### 패키지 추가/삭제

이제 필요한 패키지들을 설치해보자.  
poetry에서는 별도로 pip를 사용하지 않는다. 모두 `poetry` 명령어로 처리한다.  
다음처럼 `poetry add` 명령어로 패키지를 설치할 수 있다.

```bash
$ poetry add requests
Creating virtualenv my-python-project in /Users/heumsi/Desktop/my-python-project/.venv
Using version ^2.25.0 for requests

Updating dependencies
Resolving dependencies... (1.4s)

Writing lock file

Package operations: 5 installs, 0 updates, 0 removals
  - Installing certifi (2020.11.8)
  - Installing chardet (3.0.4)
  - Installing idna (2.10)
  - Installing urllib3 (1.26.2)
  - Installing requests (2.25.0)
```

로그를 보면 알겠지만, `requests` 패키지를 설치하는 과정 중에 `.venv/` 라는 디렉토리에 가상 환경을 만든다.  
다음 명령어로 확인해보면 다음처럼 가상 환경 설정 관련 폴더가 생긴 것을 알 수 있다.

```bash
$ ls -al
total 16
drwxr-xr-x   5 heumsi  staff   160 11 15 16:46 .
drwx------@ 12 heumsi  staff   384 11 15 16:40 ..
drwxr-xr-x   6 heumsi  staff   192 11 15 16:46 .venv  # 가상 환경 관련 폴더
-rw-r--r--   1 heumsi  staff  2947 11 15 16:46 poetry.lock
-rw-r--r--   1 heumsi  staff   294 11 15 16:46 pyproject.toml
```

poetry 내부에 virutalenv 가 내장되어 있어, pyenv로 설정한 현재 파이썬 버전으로 가상환경을 만드는 것이다.  
현재 디렉토리에서 `poetry add` 를 최초 할 시에만 이렇게 만들어진다.

추가로 몇 개의 패키지를 더 설치해주자.  
이때 `poetry add` 명령어의 옵션으로 `-D` 를 붙여주면 개발 환경에서만 사용할 패키지를 따로 설치할 수 있다.

```bash
$ poetry add pandas
$ poetry add pytest -D
```

그리고 다음처럼 `poetry show` 명령어로 설치된 패키지들을 확인할 수 있다.  
`--tree` 옵션을 주면 트리 형태로 의존성을 표시한다.

```bash
$ poetry show --tree
pandas 1.1.4 Powerful data structures for data analysis, time series, and statistics
├── numpy >=1.15.4
├── python-dateutil >=2.7.3
│   └── six >=1.5
└── pytz >=2017.2
pytest 6.1.2 pytest: simple powerful testing with Python
├── atomicwrites >=1.0
├── attrs >=17.4.0
├── colorama *
├── iniconfig *
├── packaging *
│   ├── pyparsing >=2.0.2
│   └── six *
├── pluggy >=0.12,<1.0
├── py >=1.8.2
└── toml *
requests 2.25.0 Python HTTP for Humans.
├── certifi >=2017.4.17
├── chardet >=3.0.2,<4
├── idna >=2.5,<3
└── urllib3 >=1.21.1,<1.27
```

`--no-dev` 옵션을 주면 개발 환경에 설치한 패키지는 제외하고 볼 수 있다.

```bash
$ poetry show --tree --no-dev
pandas 1.1.4 Powerful data structures for data analysis, time series, and statistics
├── numpy >=1.15.4
├── python-dateutil >=2.7.3
│   └── six >=1.5
└── pytz >=2017.2
requests 2.25.0 Python HTTP for Humans.
├── certifi >=2017.4.17
├── chardet >=3.0.2,<4
├── idna >=2.5,<3
└── urllib3 >=1.21.1,<1.27
```

패키지 삭제는 `poetry remove` 명령어를 사용한다.

```bash
$ poetry remove pandas
```

### 가상 환경 들어가기

`pyenv shell` 명령어로 가상 환경에 진입할 수 있다.

```bash
$ poetry shell
Spawning shell within /Users/heumsi/Desktop/my-python-project/.venv

(.venv) $ 
```

가상 환경에서 나가고 싶으면 `exit` 명령어를 주면 된다.

```bash
(.venv) $ exit
$
```

### requirements.txt 추출하기

경우에 따라 `requirements.txt` 가 필요할 수 있다.  
`poetry export` 명령어로 `requirements.txt` 를 만들 수 있다.

```bash
$ poetry export -f requirements.txt > requirements.txt

$ ls -al
total 40
drwxr-xr-x   6 heumsi  staff   192 11 15 17:30 .
drwx------@ 12 heumsi  staff   384 11 15 16:40 ..
drwxr-xr-x   6 heumsi  staff   192 11 15 16:46 .venv
-rw-r--r--   1 heumsi  staff  8832 11 15 17:23 poetry.lock
-rw-r--r--   1 heumsi  staff   312 11 15 17:23 pyproject.toml
-rw-r--r--   1 heumsi  staff   928 11 15 17:30 requirements.txt  # 생성되었다!
```

이 외 더 많은 명령어들이 있지만, 일단 내가 주로 사용하는 필수적인 명령어들만 소개해보았다.  
더 자세한 사항은 공식 [GitHub Readme](https://github.com/python-poetry/poetry) 를 읽어보자.

## 실제로 사용할 땐.

나는 파이썬 개발 IDE로 파이참(Pycharm)을 주로 쓰곤 한다.  
어느 IDE나 파이썬을 사용할 땐 파이썬 인터프리터와 가상 환경을 설정해줘야 하는데, [파이참에 Poetry Plugin](https://plugins.jetbrains.com/plugin/14307-poetry)이 있다. 이걸로 `.venv/` 내에 있는 파이썬 인터프리터를 설정해주면, 인터프리터와 가상 환경 설정은 손쉽게 끝난다.  
그리고 이렇게 poetry를 쓰기 시작하면 `pip install` 은 일절 안 쓰게 된다.

개인이 아닌 팀과 함께 개발하는 파이썬 프로젝트라면 타 팀원들이 poetry를 쓰지 않을 가능성이 높다.  
따라서, `poetry.lock`, `pyproject.toml`, `.venv/` 는 모두 `.gitignore` 에 추가하여 숨기는 편이다.  
대신 `requirements.txt` 로 뽑아내어 사용 중인 패키지를 공유한다.

프로젝트를 도커로 배포할 때도 마찬가지다. `Dockerfile` 에 `poetry` 를 깔고 초기화하고.. 하는 것보다는  
그냥 `requirements.txt` 로 뽑아내어 `pip install -r requirements.txt` 로 해결한다.  
즉, 내 로컬 개발환경에서만 poetry를 사용하는 셈이다.

현재 나는 pyenv + poetry 조합으로 완전히 틀었지만, 훗날 더 좋은 방법이 생긴다면 바뀔 수도 있을 거 같다.  
그때가 되면 지금처럼 몇 개월 사용해본 후, 확신이 들 때 다시 관련 글을 올려봐야겠다.

