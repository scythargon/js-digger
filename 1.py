#! /usr/bin/env python
# -*- coding: utf-8 -*-

import gtk,webkit,pyinotify,thread,os,Image,time,gobject,cairo,sys
#from transparent import Transparent
#import Pyro4
win = gtk.Window(gtk.WINDOW_TOPLEVEL)
#win.set_type_hint(gtk.gdk.WINDOW_TOPLEVEL)
win.set_keep_above(True)
web = webkit.WebView()
web.set_transparent(True)
file_='1.html'
if len(sys.argv)<4:
    print 'whut?'
    sys.exit(0)

file_ = sys.argv[1]
x = int(sys.argv[2])
y = int(sys.argv[3])

def reload_tmpl(tmpl):
    print 'reloading tmpl ', tmpl
    f = open('templates/'+tmpl)
    t = f.read()
    f.close()
    s = 'reload_fx_forum_tmplt("'+t+'")'
    s = s.replace('\n','')
    #print s
    web.execute_script(s)

#Transparent.makeTransparent(win)
#Transparent.makeTransparent(web)
win.add(web)
def reload_html():
    #print '/'.join(os.path.abspath( __file__ ).split('/')[:-1])
    #exit()
    web.open('file://'+'/'.join(os.path.abspath( __file__ ).split('/')[:-1])+'/'+file_)
    #web.open('http://localhost:8080/')
    #web.load_html_string(f.read(),"file://html.html/")
    #f.close()
    
win.set_size_request(300,300)
win.resize(300,300)
win.move(x,y)
win.set_decorated(False)

win.set_events(gtk.gdk.EXPOSURE_MASK
                         | gtk.gdk.LEAVE_NOTIFY_MASK
                         | gtk.gdk.BUTTON_PRESS_MASK
                         | gtk.gdk.BUTTON_RELEASE_MASK
                         | gtk.gdk.POINTER_MOTION_MASK
                         | gtk.gdk.POINTER_MOTION_HINT_MASK)

#win.connect("motion_notify_event", enter_notify)
win.show_all()

def set_mask(really):
    win.masked=really
    #b=gtk.gdk.bitmap_create_from_data(win.window,8,win.window.get_size())
    size=win.window.get_size()
    print size
    bitmap=gtk.gdk.Pixmap(win.window,size[0],size[1],1)
    
    cr = bitmap.cairo_create()
    #cr = win.window.cairo_create()
    visible = 0.0 if really else 1
    cr.set_operator(cairo.OPERATOR_SOURCE)
    cr.set_source_rgba(0.0,0.0,0.0,visible)
    cr.rectangle((0,0)+size)
    cr.fill()  
    if really:
        cr.set_operator(cairo.OPERATOR_OVER)
        cr.set_source_rgba(0.0,0.0,0.0,1)
        cr.rectangle(size[0]*0.808,size[1]*0.15,10,10)
        cr.fill()  
    #win.queue_draw()
    win.window.input_shape_combine_mask(bitmap,0,0)
    print 'ready'
def click_through():
    win.set_app_paintable(True)
    gobject.timeout_add(1000, set_mask,True)
#click_through()
last_t=time.time()
class OnWriteHandler(pyinotify.ProcessEvent):
    def my_init(self, file_):
        self.file_=file_
    def process_IN_CLOSE_WRITE(self, event):
        global last_t
        #if (event.pathname.endswith(self.file_)):
        web.reload()
        if (event.pathname.endswith('style.css')):
            reload_css()
        if "templates" in event.pathname:
            reload_tmpl(event.pathname.split('/')[-1])

def monitor(path='./'):
    wm = pyinotify.WatchManager()
    handler = OnWriteHandler(file_=file_)
    notifier = pyinotify.Notifier(wm, default_proc_fun=handler)
    wm.add_watch(path, pyinotify.ALL_EVENTS,rec=True)
    print '==> Start monitoring %s (type c^c to exit)' % path
    notifier.loop()
thread.start_new(monitor,('./',))
reload_html()



gtk.main()
