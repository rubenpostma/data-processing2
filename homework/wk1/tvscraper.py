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
    
      
    komma = ", "    # komma om tussen acteurs en genre te zetten
    imdb = []       # imdb als list
    
    for data in dom.by_tag("td.title"):  # zoek in table gegevens van serie
        gegevens = []
        for title in data.by_tag("a")[0]:   # zoek naar eerste a tag, want dat is de titel
            print title.content.encode('ascii', 'ignore') # voorkomt unicode error
            gegevens.append(title.content)
                
        for rating in data.by_tag("span.value"):        # zoek naar ratings
            gegevens.append(plaintext(rating.content))  # voegt titel aan gegevens toe
                
        for genres in data.by_tag("span.genre"):    
            soort = []                                  # maakt list soort
            for genre in genres.by_tag("a"):            # zoek naar genre
                soort.append(plaintext(genre.content))  # voegt genres toe aan soort
            seq = komma.join(soort)                     # maakr van list een string
            gegevens.append(seq)                        # voegt genre string aan gegevens
                
        for actors in data.by_tag("span.credit"):
            acteurs = []                                # maak list acteurs 
            for actor in actors.by_tag("a"):            # zoek naar acteurs
                actor.encode('ascii', 'ignore')         # voorkomt unicode error
                acteurs.append(plaintext(actor.content))# voegt gevonden acteurs aan list
            sq = komma.join(acteurs)                    # maakt van list string
            gegevens.append(sq)                         # voegt acteur string aan gegegevens toe
                
        for runtime in data.by_tag("span.runtime"):     # zoek naar runtime
            gegevens.append(runtime.content.partition(' ')[0]) # voegt runtime aan gegevens toe 
               
        imdb.append(gegevens)   # voegt de list van gegevens aan list imdb
            
    return imdb # return list 


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest ranking TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Ranking', 'Genre', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK
    for serie in tvseries:      # voor elke lijst aan gegevens in lijst imdb
        writer.writerow(serie)  # schrijf gegevens in rij csv bestand

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
