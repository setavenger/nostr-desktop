import {getUserPubKey} from "../settings/user";
import {nip19} from "nostr-tools";

export const Message = ({message: {author, text, timestamp}}) => {
    return (
        <div className="w-full p-1 flex flex-col">
            <div className={"flex flex-row items-center"}>
                <img src={author.imageUrl} className="w-8 h-8 rounded-full mr-2"/>
                <div className={`w-full `}>
                    <p className="font-bold">{nip19.npubEncode(author.pubkey).slice(0, 16)}</p>
                    <p className={`${author.pubkey === getUserPubKey() ? "bg-purple-400" : "bg-gray-200"}  rounded-xl p-2`}>
                        {text}
                    </p>
                    {/*<p className="text-gray-500 text-xs text-right">{timestamp}</p>*/}
                </div>
            </div>
        </div>
    );
};
