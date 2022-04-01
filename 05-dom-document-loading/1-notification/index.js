export default class NotificationMessage {
  static activeNotification;

  element;
  timerId;

  constructor(message = '', {
    duration = 2000,
    type = 'success',
  } = {}) {
    this.message = message;
    this.durationSec = (duration/1000) + 's';
    this.type = type;
    this.duration = duration;

    this.render();
  }

  template(){
    return `<div class="notification ${this.type}" style="--value:${this.durationSec}">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">Notification</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                </div>
            </div>
    `;
  }

  render(){
    const element = document.createElement('div');

    element.innerHTML = this.template();
    this.element = element.firstElementChild; //удаляем обёртку див из ДОМ
  }

  show(parent = document.body){
    if (NotificationMessage.activeNotification){
      NotificationMessage.activeNotification.remove();
    }

    parent.append(this.element);

    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);

    NotificationMessage.activeNotification = this;
  }

  remove(){
    clearTimeout(this.timerId);

    if (this.element){
      this.element.remove();
    }
  }

  destroy(){
    this.remove();
    this.element = null;
    NotificationMessage.activeNotification = null;
  }
}
