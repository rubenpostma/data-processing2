# importeer libraries
# Ruben Postma
import csv
import json

# open files
data = open('maxtempjuli2015.csv', 'r')
jsonfile = open('knmi.json', 'w')

# lees csv file 
reader = csv.reader(data, delimiter = ",")
# en schrijf elke row in JSON file
for row in reader:
	json.dump(row[1:], jsonfile)
	jsonfile.write('\n')

