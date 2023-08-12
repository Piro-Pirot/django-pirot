import sys
import os
import hashlib
import hmac
import base64
import requests
import time

def	make_signature(string):

	secret_key = "55WgVrdVqRbc5WHnlt5CsWs6KQIHFBRo3ck3iRdJ"				# secret key (from portal or Sub Account)
	secret_key = bytes(secret_key, 'UTF-8')

	method = "POST"
	uri = "/sms/v2/services/ncp:sms:kr:285290282105:pirot_sms_auth/messages"


	signingKey = base64.b64encode(hmac.new(secret_key, string, digestmod=hashlib.sha256).digest())
	return signingKey