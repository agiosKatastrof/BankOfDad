import pymongo
import datetime
from pymongo import MongoClient

amt = -1


usersmapRev = {
  'dad' : "cKM3ENqak9wenR75W",
  'Jet' : "gYzdjntuyqWHtGihL",
  'Elias' : "hhy3c45Wei94pQ3iu",
  'Lorien' : "AJdvgWqhvGpwc4vri",
  'Galadriel' : "cdAq6ZMEfnB3H8TXS"
}

def doOffering(username,db,amt):
    print username, " offering ", amt
    transaction = { 'username':username,
                'amount':amt,
                'type':'offering',
                'createdAt': datetime.datetime.now(),
                'owner': usersmapRev[username]
                }
    
    db.transactions.insert_one(transaction).inserted_id


print "Connecting..."

client = MongoClient('mongodb://localhost:3001/meteor')
db = client.meteor
print "Connected to: ", db.client

doOffering('Jet',db,amt)
doOffering('Lorien',db,amt)
doOffering('Galadriel',db,amt)
doOffering('Elias',db,amt)









print "Exiting..."
client.close()
