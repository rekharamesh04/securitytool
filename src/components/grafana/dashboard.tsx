"use client";
import React from 'react';

interface GrafanaDashboardProps {
    url?: string;
}

const GrafanaDashboard: React.FC<GrafanaDashboardProps> = (props) => {
    const { url } = props
    return (
        <div style={{ width: "100%", height: "100vh" }}>

            <iframe
                src={url}
                width="100%"
                height="100%"
                title="Grafana Dashboard"
                allow="fullscreen"
                sandbox="allow-forms allow-scripts allow-same-origin"
            ></iframe>


        </div>
    );
};

export default GrafanaDashboard;

