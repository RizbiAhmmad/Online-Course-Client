import React from 'react';
import Banner from './Banner';
import CourseCard from './CourseCard';
import Reviews from './Reviews';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <CourseCard></CourseCard>
            <Reviews></Reviews>
        </div>
    );
};

export default Home;