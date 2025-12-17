import React from 'react';
import PageTitle from '../components/PageTitle';

const Symposium = () => {
    return (
        <div className="bg-white min-h-screen">
            <PageTitle title="Symposium" />
            <div className="max-w-5xl mx-auto px-8 py-12">
                <div className="text-center py-20 bg-gray-50 rounded shadow">
                    <h3 className="text-2xl font-bold text-unhro-dark-blue mb-4">Coming Soon</h3>
                    <p className="text-gray-600">
                        Details about the next Health Research Symposium will be posted here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Symposium;
