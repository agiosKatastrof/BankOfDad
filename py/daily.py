import pymongo
import datetime
from pymongo import MongoClient


def doTotal(username,db):

    #endT = datetime.datetime.now();
    #span = datetime.timedelta(days=range);
    #beginT = endT - span;

    #query = {"username": username, "createdAt": { "$gt": beginT}};
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

client = MongoClient('mongodb://nagisa:jetTheD0g@localhost:3001/meteor')
db = client.meteor
print "Connected to: ", db.client

doTotal('Jet',db)
doTotal('Lorien',db)
doTotal('Galadriel',db)
doTotal('Elias',db)



print "Exiting..."
client.close()
