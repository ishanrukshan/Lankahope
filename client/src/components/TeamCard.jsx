import React from 'react';
import { FaUser } from 'react-icons/fa';
import API from '../config/api';

const TeamCard = ({ member }) => {
    return (
        <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Image Section */}
            <div className="h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                {member.imagePath ? (
                    <img
                        src={API.imageUrl(member.imagePath)}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sl-maroon/10 to-sl-gold/10">
                        <FaUser size={48} className="text-sl-maroon/30" />
                    </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-sl-maroon/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Details Block */}
            <div className="p-5 text-center border-t-4 border-sl-gold">
                <h3 className="font-serif text-lg text-sl-maroon font-medium mb-1">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.title}</p>

                {member.bio && (
                    <button className="mt-4 px-6 py-2 text-xs font-bold uppercase tracking-wider text-sl-maroon border border-sl-maroon hover:bg-sl-maroon hover:text-white transition-all duration-300 rounded">
                        View Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default TeamCard;
