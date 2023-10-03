import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { TextInput } from '@strapi/design-system/TextInput';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import { Textarea } from '@strapi/design-system';
import { auth } from '@strapi/helper-plugin'


export default function Index({
    name,
    intlLabel,
    onChange,
    value,
    attribute,
}) {
    const { formatMessage } = useIntl();
    return (
        <TextInput
            placeholder="password"
            label={formatMessage(intlLabel)}
            type="password"
            name={name}
            onChange={(e) =>
                onChange({
                    target: { name, value: e.target.value, type: attribute.type },
                })}
            value={value}
        />

    )
}