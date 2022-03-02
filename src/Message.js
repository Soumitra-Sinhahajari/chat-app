import './Message.css';

const Message = ({sender, message, time, isImage, isSender, showName}) => {


    return (  
        <div className="message">
            {sender==='none' && (
                <div class="room-creation">
                    <p class="name">{message} at {time}</p>
                </div>
            )}
            {sender!=='none' && (
                <div class="speech-wrapper">
                    {!isSender && (
                    <div class="bubble">
                        <div class="txt">
                        <p class="name" align="left">{sender}</p>
                        <div className="message">
                            {!isImage && (<p className="text-message">{message}</p>)}
                            {isImage && (<img className="image-message" src={message} />)}
                        </div>
                        <br></br>
                        <span class="timestamp">{time}</span>
                        </div>
                        <div class="bubble-arrow"></div>
                    </div>
                    )}
                    {isSender && (
                    <div class="bubble alt">
                        <div class="txt">
                        <p class="name alt" align="right">You</p>
                        <div className="message">
                            {!isImage && (<p className="text-message">{message}</p>)}
                            {isImage && (<img className="image-message" src={message} />)}
                        </div>
                        <br></br>
                        <span class="timestamp">{time}</span>
                        </div>
                        <div class="bubble-arrow alt"></div>
                    </div>
                    )}
                </div>
            )}
        </div>

    );
}
 
export default Message;