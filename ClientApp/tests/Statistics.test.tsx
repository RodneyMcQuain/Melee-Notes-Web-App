import 'jest';
import { shallow, mount, configure } from 'enzyme';
import * as React from 'react';
import ReactSixteenAdapter from 'enzyme-adapter-react-16';
import { Statistics } from '../components/Statistic/Statistics';
import { calculateWinRate } from '../components/Statistic/Stages';

configure({ adapter: new ReactSixteenAdapter() });

const mock: any = jest.fn();
const mockPropStatistics = shallow<Statistics>(<Statistics
    match={mock}
    location={mock}
    history={mock}
/>);

describe("Calculate Win Rate", () => {
    it("calculates win rate with 10 wins and 5 loses", () => {
        expect(calculateWinRate(10, 5)).toBe("66.67");
    });

    it("calculates win rate with 10 wins and 0 loses", () => {
        expect(calculateWinRate(10, 0)).toBe("100.00");
    });

    it("calculates win rate with 0 wins and 10 loses", () => {
        expect(calculateWinRate(0, 10)).toBe("0.00");
    });

    it("calculates win rate with 0 wins and 0 loses", () => {
        expect(calculateWinRate(0, 0)).toBe("0.00");
    });
});

describe("Calculate Win Rate", () => {

});