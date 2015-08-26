import pymongo
import datetime
from pymongo import MongoClient
import json

range = 30
rate = 0.0015

creds = open('private/usersmapRev.json').read()
usersmapRev = json.loads(creds)

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
                   'owner': usersmapRev[username]["id"]
                }
    db.transactions.insert_one(transaction).inserted_id

print "Connecting..."

creds = open('private/creds.json').read()
j = json.loads(creds)

dbstr = 'mongodb://' + j['user'] + ':' + j['pw'] + '@localhost:3001/meteor'
client = MongoClient(dbstr)
db = client.meteor
print "Connected to: ", db.client

doTotal('Jet',db,range)
doTotal('Lorien',db,range)
doTotal('Galadriel',db,range)
doTotal('Elias',db,range)

print "Exiting..."
client.close()
