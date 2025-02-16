import React from "react";

function Logo({ width = "38px" }) {
    return (
        <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMAs05u9PYfgo7hbHpetcTrC9M466Zvk74lw&s"
            alt="Logo"
            style={{
                width,
                height: width,
                borderRadius: "60%",
                objectFit: "cover",
            }}
        />
    );
}

export default Logo;
