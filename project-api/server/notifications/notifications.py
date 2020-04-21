import logging
import smtplib
from config import Config

log = logging.getLogger(__name__)

conf = Config().data

class Notify:
    def __init__(self):
        self.to_addr = conf.get("requests").get("notification_email")
        self.smtp_server = conf.get("smtp").get("server")
        self.fromaddr = conf.get("smtp").get("from_addr")

    def send_pending_request_email (self, message):
        if self.to_addr != '':
            toaddrs = [self.to_addr]
            subject = "BBSAE Applications Change Request"
            content = "An application change request has been submitted.\r\n\r\n%s" % message
            msg = ("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s" % (self.fromaddr, ", ".join(toaddrs), subject, content))
            log.info("Sending email to %s" % self.to_addr)
            server = smtplib.SMTP(self.smtp_server)
            server.set_debuglevel(0)
            server.sendmail(self.fromaddr, toaddrs, msg)
            server.quit()