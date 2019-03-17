// @flow
import React, { useState, useEffect } from "react";
import Select from "react-select";
import manager from "@ledgerhq/live-common/lib/manager";
import type {
  ApplicationVersion,
  DeviceInfo
} from "@ledgerhq/live-common/lib/types/manager";

export type DataTypeApplication = {
  type: "application"
};

type Props = {
  value: ?ApplicationVersion,
  onChange: (?ApplicationVersion) => void,
  dependencies: {
    deviceInfo: DeviceInfo
  }
};

const ApplicationField = ({
  value,
  onChange,
  dependencies: { deviceInfo }
}: Props) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!deviceInfo) return;
    manager.getAppsList(deviceInfo).then(setApplications);
  }, [deviceInfo]);

  return (
    <Select
      value={value}
      options={applications}
      onChange={onChange}
      placeholder={applications.length ? "Select an app" : "Loading..."}
      getOptionLabel={app => `${app.name} (${app.version})`}
      getOptionValue={app => app.id}
    />
  );
};

export default ApplicationField;
