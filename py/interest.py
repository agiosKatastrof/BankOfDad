import pymongo
import datetime
from pymongo import MongoClient

rate = 0.015


usersmapRev = {
  'dad' : "cKM3ENqak9wenR75W",
  'Jet' : "gYzdjntuyqWHtGihL",
  'Elias' : "hhy3c45Wei94pQ3iu",
  'Lorien' : "AJdvgWqhvGpwc4vri",
  'Galadriel' : "cdAq6ZMEfnB3H8TXS"
}

def doInterest(username,db,rate):
    query = {"username": username}
    
    cursor = db.transactions.find(query)
    
    for transaction in cursor:
      print transaction 
    
    cursor.close()
    
    print username, " interest ", rate
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

doInterest('Jet',db,rate)
#doInterest('Lorien',db,rate)
#doInterest('Galadriel',db,rate)
#doInterest('Elias',db,rate)



print "Exiting..."
client.close()
