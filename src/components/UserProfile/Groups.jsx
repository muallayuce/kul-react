import React from 'react';
import './UserProfile.css';

const Groups = ({ groups }) => {
  return (
    <div className="groups">
      {groups.map((group, index) => (
        <div key={group.id} className="group">
          <h2>{group.name}</h2>
          <div className="group-posts">
            {group.posts.map(post => (
              <div key={post.id} className="group-post">
                <i className="bi bi-balloon-fill" style={{ color: "purple" }}></i> {/* Flower icon */}
                {post.content}
              </div>
            ))}
          </div>
          {index !== groups.length - 1 && (
            <div className="separator-container">
              <div className="group-separator">★ ★ ★</div>
            </div>
          )} {/* Separator */}
        </div>
      ))}
    </div>
  );
};

export default Groups;
