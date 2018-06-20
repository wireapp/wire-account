#!/usr/bin/python

import os

os.system('"pybabel" extract -k _ -k __ -F app/translations/babel.cfg --sort-by-file --omit-header -o app/translations/account.pot app')
os.system('"pybabel" init -i app/translations/account.pot -d app/translations -l de')
os.system('crowdin upload sources --identity crowdin.yaml')
os.system('crowdin download --identity crowdin.yaml')
os.system('"pybabel" update -i app/translations/account.pot -d app/translations --no-wrap -N')
os.system('"pybabel" compile -f -d app/translations')
os.system('crowdin download --identity crowdin.yaml')
