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
    print username, " interest ", rate
    transaction = { 'username':username,
                'amount':amt,
                'type':'offering',
                'createdAt': datetime.datetime.now(),
                'owner': usersmapRev[username]
                }
    
    db.transactions.insert_one(transaction).inserted_id


print "Connecting..."

client = MongoClient('mongodb://nagisa:jetTheD0g@localhost:3001/meteor')
db = client.meteor
print "Connected to: ", db.client

doOffering('Jet',db,rate)
#doOffering('Lorien',db,rate)
#doOffering('Galadriel',db,rate)
#doOffering('Elias',db,rate)









print "Exiting..."
client.close()
