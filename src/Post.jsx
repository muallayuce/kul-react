import React, {useState, useEffect} from "react";
import './Post.css'

const BASE_URL = 'http://localhost:8000/'

function Post ({ post }) {
    
    const [imageUrl, setImageUrl] = useState('')
    const [comments, setComments] = useState('')

    useEffect(() => {
        if (post.image_url != null) {
            setImageUrl(post.image_url)
    //    } else {
     //       setImageUrl(BASE_URL + post.image_url)
        }
    }, [])

    return (
        <div className="post">
            <img
            className="post_image"
            src={imageUrl}
            />
        </div>
    )
}

export default Post