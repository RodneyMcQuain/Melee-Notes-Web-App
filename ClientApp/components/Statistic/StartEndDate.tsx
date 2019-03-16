import * as React from 'react';

interface StartEndDateProps {
    startDate: string;
    endDate: string;
    handleFieldChange: Function;
}

export const StartEndDate = (props: StartEndDateProps) => <>
    <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
        <label htmlFor="startDate" >Start Date</label>
        <input type="date" name="startDate" className="form-control" value={ props.startDate } onChange={ e => props.handleFieldChange(e) } />
    </div>

    <div className="statistic-form-margin form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
        <label htmlFor="endDate" >End Date</label>
        <input type="date" name="endDate" className="form-control" value={ props.endDate } onChange={ e => props.handleFieldChange(e) } />
    </div>
</>