# Ruben Postma
# 11075708

# importeer libraries
import csv
import json

# open files
data = open('WBdata.csv', 'r')
jsonfile = open('data.json', 'w')

# lees csv file 
reader = csv.reader(data, delimiter = ";")
# en schrijf elke row in JSON file
for row in reader:
	json.dump(row[:2], jsonfile)
	jsonfile.write('\n')

