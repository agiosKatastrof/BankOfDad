import pymongo
import datetime
from pymongo import MongoClient

duration = 30

usersmapRev = {
  'dad' : "cKM3ENqak9wenR75W",
  'Jet' : "gYzdjntuyqWHtGihL",
  'Elias' : "hhy3c45Wei94pQ3iu",
  'Lorien' : "AJdvgWqhvGpwc4vri",
  'Galadriel' : "cdAq6ZMEfnB3H8TXS"
}

def doDaily(username,db,duration):
    query = {"username": username}
    
    cursor = db.transactions.find(query)
    
    for transaction in cursor:
      print transaction[u'amount'] 
    
    cursor.close()
    
    print username, " duration ", duration
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

doDaily('Jet',db,duration)
#doDaily('Lorien',db,duration)
#doDaily('Galadriel',db,duration)
#doDaily('Elias',db,duration)



print "Exiting..."
client.close()
