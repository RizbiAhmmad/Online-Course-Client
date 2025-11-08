import React from 'react';
import Banner from './Banner';
import Reviews from './Reviews';
import StatsSection from './StatsSection';
import CourseCard from '../Courses/CourseCard';

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