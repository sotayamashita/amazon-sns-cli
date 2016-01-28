import { AWS } from 'aws-cli';

export default class Notification {

  constructor(sns,message, target) {
    this.sns = sns;
    this.messsage = message;
    this.target = target;
  }

  get message() {
    return this.message;
  }

  set message(message) {
    this.message = message;
  }

  send() {
    var params = {
      Message: this.messsage,
      TargetArn: this.target
    };
    this.sns.publish(params, (err, data) => {
      if (err) console.log(err);
      else     console.log(data);
    })
  }
}
