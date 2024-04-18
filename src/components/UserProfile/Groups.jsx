import React from 'react';
import './UserProfile.css';

const Groups = ({ groups }) => {
  return (
    <div className="groups">
      {groups.map(group => (
        <div key={group.id} className="group">
          <h2>{group.name}</h2>
          <div className="group-posts">
            {group.posts.map(post => (
              <div key={post.id} className="group-post">{post.content}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Groups;
