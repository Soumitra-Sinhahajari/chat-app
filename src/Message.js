import './Message.css';

const Message = ({sender, message, time, isSender, showName}) => {

    return (  
        <div className="message">
            <div class="container">
                <div className="sender-name">
                    {isSender && showName && <p align="right">{sender}</p>}
                    {!isSender && showName && <p align="left">{sender}</p>}
                </div>
                <div className="message-body">
                    {isSender && <p align="right">{message}</p>}
                    {!isSender && <p align="left">{message}</p>}
                    {isSender && <span class="time-left">{time}</span>}
                    {!isSender && <span class="time-right">{time}</span>}
                </div>
            </div>
        </div>
    );
}
 
export default Message;