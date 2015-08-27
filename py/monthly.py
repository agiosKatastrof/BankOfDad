import pymongo
import datetime
from pymongo import MongoClient
import json


umap = open('/home/joe/BankOfDad/private/usersmapRev.json').read()
usersmapRev = json.loads(umap)

def doTrans(username,db,amt,trans_type):
    print username, " ", trans_type, " ", amt
    transaction = { 'username':username,
                'amount':amt,
                'type':trans_type,
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

doTrans('Jet',db,-7,'Adobe')
doTrans('Elias',db,-7,'Adobe')
doTrans('Lorien',db,-7,'Adobe')
doTrans('Galadriel',db,-7,'Adobe')

print "Exiting..."
client.close()
