.PHONY: dev pip_dev lint clean

dev: env dev.py
	env/bin/python3.7 dev.py

env pip_dev: requirements.txt
	python3.7 -m venv env
	env/bin/pip3.7 install --upgrade pip
	env/bin/pip3.7 install -r requirements.txt

lint: sensor main.py dev.py
	env/bin/flake8 sensor/

clean:
	rm -rf env
