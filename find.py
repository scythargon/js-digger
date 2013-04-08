import os,sys
for l in sys.path:
	s = 'find '+l+' | grep Transparent'
	#print s
	process = os.popen(s)
	preprocessed = process.read()
	print preprocessed
	process.close()