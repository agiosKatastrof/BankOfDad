import pymongo
import datetime
from pymongo import MongoClient
import json

def doTotal(username,db):

    query = {"username": username}
    cursor = db.transactions.find(query)
    
    sum = 0
    for transaction in cursor:
      sum += transaction[u'amount']   
    cursor.close()
    
    print username, " sum ", sum
    
    sum = { 'username':username,
            'sum':sum,
            'createdAt': datetime.datetime.now()
          }
    db.sums.insert_one(sum).inserted_id

print "Connecting..."

creds = open('private/creds.json').read()
j = json.loads(creds)

dbstr = 'mongodb://' + j['user'] + ':' + j['pw'] + '@localhost:3001/meteor'
client = MongoClient(dbstr)
db = client.meteor
print "Connected to: ", db.client

doTotal('Jet',db)
doTotal('Lorien',db)
doTotal('Galadriel',db)
doTotal('Elias',db)



print "Exiting..."
client.close()
