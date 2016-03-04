#!/usr/bin/python
# -*- coding: iso-8859-15 -*-

# Ruben Postma
# importeer libraries
import csv
import json


# map.legend();
# open files
data = open('WBdata.csv', 'r')
jsonfile = open('map.json', 'w')

# lees csv file 
reader = csv.reader(data, delimiter = ";")
# en schrijf elke row in JSON file
dataset = []

for row in reader:
	print row
	dataset.append({ row[3] :{"percentage" : row[4] }})
			

print dataset
json.dump(dataset, jsonfile)


