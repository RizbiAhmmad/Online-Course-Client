import React from 'react';
import Banner from './Banner';
import CourseCard from './CourseCard';
import Reviews from './Reviews';
import StatsSection from './StatsSection';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <CourseCard></CourseCard>
            <Reviews></Reviews>
            <StatsSection></StatsSection>
        </div>
    );
};

export default Home;