import React from 'react';
import PageTitle from '../components/PageTitle';

const Resources = () => {
    return (
        <div className="bg-white min-h-screen">
            <PageTitle title="Resources" />
            <div className="max-w-5xl mx-auto px-8 py-12">
                <div className="bg-gray-50 border-l-4 border-unhro-light-blue p-8 rounded">
                    <h3 className="text-xl font-bold text-unhro-dark-blue mb-4">Downloads & Publications</h3>
                    <p className="text-gray-700">
                        (No specific design provided. This is a generic content placeholder.)
                    </p>
                    <ul className="list-disc ml-6 mt-4 text-blue-700">
                        <li><a href="#" className="hover:underline">UNHRO Strategic Plan 2020-2025.pdf</a></li>
                        <li><a href="#" className="hover:underline">Annual Report 2023.pdf</a></li>
                        <li><a href="#" className="hover:underline">Research Guidelines.pdf</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Resources;
