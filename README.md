# aws-iot-stateful-button
A simple software dash button that sents an email using an aws iot infrastructure.
It keeps the count of email sents using the shadow service

There is a provision.sh file that sets up all the cloud components (IOT, SNS, IAM)
There is a teardown.sh files that cleans it up.
You just need to look at the config.sh file and put your credentials.

We defined previously in IAM using the AWS console a role with appropriated access to IAM, SNS and IOT. We used 
the credentials of this role to setup/teardown this experiment.

Index.js has the node.js code that sends a soft 'click' to AWS IOT. There, a rule fires an SNS notification 
that sends an email with the dash button payload as the body of the message.
The code recovers the state of the button (count of emails sent) and increments the count when gets confirmation
that the message was sent.

Enjoy!
