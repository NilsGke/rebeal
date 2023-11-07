"use client";
import { Settings } from "@/app/types";
import Switch from "@/components/Switch";
import { useState } from "react";
import toast from "react-simple-toasts";

export default function SettingToggle({
  settings: defaultSettings,
  propertyName,
}: {
  settings: Settings;
  propertyName: keyof Settings;
}) {
  const [settings, setSettings] = useState(defaultSettings);
  const thisSetting = settings[propertyName];

  if (typeof thisSetting !== "boolean")
    throw Error(
      `setting (${propertyName}) is not of type boolean but was trying to render a switch`
    );

  const toggle = () => {
    const newSettings = structuredClone(settings);
    const currentValue = thisSetting;
    newSettings[propertyName] = !currentValue;
    setSettings(newSettings);

    fetch("/api/settings/saveMemories", {
      method: "POST",
      body: JSON.stringify({
        value: !currentValue,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw Error(await res.text());
      })
      .catch<void>((error) => {
        const newSettings = structuredClone(settings);
        newSettings[propertyName] = currentValue;
        setSettings(newSettings);
        console.error(error);

        toast("❌ something went wrong");
      });
  };

  return <Switch checked={thisSetting} onChange={toggle} />;
}
