#!/usr/bin/env python
# Name: Ruben Postma
# Student number: 11075708
'''
This script scrapes IMDB and outputs a CSV file with highest ranking tv series.
'''
# IF YOU WANT TO TEST YOUR ATTEMPT, RUN THE test-tvscraper.py SCRIPT.
import csv

from pattern.web import URL, DOM, plaintext

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest ranking TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Ranking
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RANKING TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    
      
   
    imdb = []
    for series in dom.by_tag("table.results"):
        for data in series.by_tag("td.title"):
            gegevens = []
            for title in data.by_tag("a")[0]:
                gegevens.append(title)
                print title
            for rating in data.by_tag("span.value"):
                gegevens.append(plaintext(rating.content))
                print plaintext(rating.content)
            for genres in data.by_tag("span.genre"):
                soort = []
                for genre in genres.by_tag("a"):
                    soort.append(plaintext(genre.content))
                print soort
                gegevens.append(soort)
            for actors in data.by_tag("span.credit"):
                acteurs = []
                for actor in actors.by_tag("a"):
                    acteurs.append(plaintext(actor.content))
                print acteurs 
                gegevens.append(acteurs)
            for runtime in data.by_tag("span.runtime"):
                gegevens.append(runtime.content.partition(' ')[0])
                print runtime.content.partition(' ')[0]
            print gegevens
            print "\n"
            imdb.append(gegevens)
            # print imdb
    return imdb  # replace this line as well as appropriate


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest ranking TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Ranking', 'Genre', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK
    for serie in tvseries:
        writer.writerow(serie)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in testing / grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
