import './Message.css';

const Message = ({sender, message, time, isSender, showName}) => {

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
                        <p class="message" align="left">{message}</p>
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
                        <p class="message" align="left">{message}</p>
                        <br></br>
                        <span class="timestamp">{time}</span>
                        </div>
                        <div class="bubble-arrow alt"></div>
                    </div>
                    )}
                </div>
            )}
        </div>

        // <div className="message">
        //     <div class="container">
        //         <div className="sender-name">
        //             {isSender && showName && <p align="right">{sender}</p>}
        //             {!isSender && showName && <p align="left">{sender}</p>}
        //         </div>
        //         <div className="message-body">
        //             {isSender && <p align="right">{message}</p>}
        //             {!isSender && <p align="left">{message}</p>}
        //             {isSender && <span class="time-left">{time}</span>}
        //             {!isSender && <span class="time-right">{time}</span>}
        //         </div>
        //     </div>
        // </div>
    );
}
 
export default Message;