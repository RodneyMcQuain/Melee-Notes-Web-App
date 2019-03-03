import 'jest';
import { shallow, mount, configure } from 'enzyme';
import * as React from 'react';
import ReactSixteenAdapter from 'enzyme-adapter-react-16';
import { Statistics } from '../components/Statistic/Statistics';

configure({ adapter: new ReactSixteenAdapter() });

const mock: any = jest.fn();
const mockPropStatistics = shallow<Statistics>(<Statistics
    match={ mock }
    location={ mock }
    history={ mock }
/>);

test('win rate with 10 wins and 5 loses', () => {
    expect(mockPropStatistics.instance().calculateWinRate(10, 5)).toBe("66.67");
});

test('win rate with 10 wins and 0 loses', () => {
    expect(mockPropStatistics.instance().calculateWinRate(10, 0)).toBe("100.00");
});

test('win rate with 0 wins and 10 loses', () => {
    expect(mockPropStatistics.instance().calculateWinRate(0, 10)).toBe("0.00");
});

test('win rate with 0 wins and 0 loses', () => {
    expect(mockPropStatistics.instance().calculateWinRate(0, 0)).toBe("0.00");
});