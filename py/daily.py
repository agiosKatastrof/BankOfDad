import pymongo
import datetime
from pymongo import MongoClient

range = 30


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
    cursor = db.transactions.find(query)
    
    for transaction in cursor:
      print transaction[u'amount'] 
    
    cursor.close()
    
    print username, " interest ", range
    '''
    interest = { 'username':username,
                'amount':amt,
                'type':'offering',
                'createdAt': datetime.datetime.now(),
                'owner': usersmapRev[username]
                }
    '''
    #db.transactions.insert_one(transaction).inserted_id



print "Connecting..."

client = MongoClient('mongodb://nagisa:jetTheD0g@localhost:3001/meteor')
db = client.meteor
print "Connected to: ", db.client

doTotal('Jet',db,range)
#doTotal('Lorien',db,range)
#doTotal('Galadriel',db,range)
#doTotal('Elias',db,range)



print "Exiting..."
client.close()
