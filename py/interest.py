import pymongo
import datetime
from pymongo import MongoClient

range = 30
rate = 0.0015


usersmapRev = {
  'dad' : "cKM3ENqak9wenR75W",
  'Jet' : "gYzdjntuyqWHtGihL",
  'Elias' : "hhy3c45Wei94pQ3iu",
  'Lorien' : "AJdvgWqhvGpwc4vri",
  'Galadriel' : "cdAq6ZMEfnB3H8TXS"
}

def doTotal(username,db,range):

    endT = datetime.datetime.now();
    span = datetime.timedelta(days=range);
    beginT = endT - span;

    query = {"username": username, "createdAt": { "$gt": beginT}};
    cursor = db.sums.find(query)
    
    sums = 0.0
    n = 0
    for transaction in cursor:
      sums += transaction[u'sum']
      n += 1
    cursor.close()
    
    avg = sums/n
    interest = float("{0:.2f}".format(avg*rate))
    
    print username, " sums ", sums, " n ", n, " avg ", avg, " interest ", interest
    
    transaction = {'username':username,
                   'amount':interest,
                   'type':'interest',
                   'createdAt': datetime.datetime.now(),
                   'owner': usersmapRev[username]
                }
    db.transactions.insert_one(transaction).inserted_id

print "Connecting..."

client = MongoClient('mongodb://nagisa:jetTheD0g@localhost:3001/meteor')
db = client.meteor
print "Connected to: ", db.client

doTotal('Jet',db,range)
doTotal('Lorien',db,range)
doTotal('Galadriel',db,range)
doTotal('Elias',db,range)

print "Exiting..."
client.close()
