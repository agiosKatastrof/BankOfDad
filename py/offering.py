import pymongo
import datetime
from pymongo import MongoClient
import json

amt = -1

umap = open('/home/joe/BankOfDad/private/usersmapRev.json').read()
usersmapRev = json.loads(umap)

def doOffering(username,db,amt):
    print username, " offering ", amt
    transaction = { 'username':username,
                'amount':amt,
                'type':'offering',
                'createdAt': datetime.datetime.now(),
                'owner': usersmapRev[username]["id"]
                }
    
    db.transactions.insert_one(transaction).inserted_id


print "Connecting..."
creds = open('/home/joe/BankOfDad/private/creds.json').read()
j = json.loads(creds)

dbstr = 'mongodb://' + j['user'] + ':' + j['pw'] + '@localhost:3001/meteor'
client = MongoClient(dbstr)
db = client.meteor
print "Connected to: ", db.client

doOffering('Jet',db,amt)
doOffering('Lorien',db,amt)
doOffering('Galadriel',db,amt)
doOffering('Elias',db,amt)









print "Exiting..."
client.close()
