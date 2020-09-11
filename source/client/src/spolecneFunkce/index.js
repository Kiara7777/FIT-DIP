import React from "react";
import {Field} from "formik";
import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {KeyboardDatePicker} from "@material-ui/pickers";

/**
 * Ruzne funce a komponenty, ktere se mnohokrat ve programu vyuzivaji
 *
 * Autor: Sara Skutova
 * */
/*******************************************************************************************/
/**
 * Funkce na otestovani zda se po editu a potvrzeni data v radku tabulky zmenila.
 * Tuto funkcy vyuziva vetsina komponent
 * */
export const testIfChange = (newData, oldData) => {
    const newD = {...newData};
    const oldD = {...oldData};

    delete newD.tableData;
    delete oldD.tableData;

    return JSON.stringify(newD) !== JSON.stringify(oldD);
};

/**
 * Funkce z dat kategorie vytvori lookup pro tabulky, ktere kategorii obsahuji
 * */
export const createCategoryLookup = (data) => {
    let newLookup = {};

    data.forEach(item => {
        newLookup[item.id] = item.nazev;
    });

    return newLookup;
};

/**
 * Z dat ziskanych o rizicich na projektu vybere potrebne informace, ty informace pak pujdou do REDUXU
 * */
export const getRiskInfo = (risks, array) => {
    if (array) {
        return risks.map(risk => {
            return {
                id: risk.id.idRizika,
                stav: risk.stav,
                pravdepodobnost: risk.pravdepodobnost,
                dopad: risk.dopad,
                popisDopadu: risk.popisDopadu,
                planReseni: risk.planReseni,
                priorita: risk.priorita,
                nazev: risk.idRizikoR.nazev,
                popis: risk.idRizikoR.popis,
                kategorie: risk.idRizikoR.kategorie,
                uzivID: risk.idUzivatelR.id,
                uzivNazev: risk.idUzivatelR.nazev
            }
        });
    } else {
        return {
            id: risks.id.idRizika,
            stav: risks.stav,
            pravdepodobnost: risks.pravdepodobnost,
            dopad: risks.dopad,
            popisDopadu: risks.popisDopadu,
            planReseni: risks.planReseni,
            priorita: risks.priorita,
            nazev: risks.idRizikoR.nazev,
            popis: risks.idRizikoR.popis,
            kategorie: risks.idRizikoR.kategorie,
            uzivID: risks.idUzivatelR.id,
            uzivNazev: risks.idUzivatelR.nazev
        };
    }
};

/**
 * Funkce na odhlaseni
 * */
/*
export const logOut = () => {
    const dispatch = useDispatch();
    dispatch(cleanRedux());
    ability.update([]);
};
*/
/**POLICKA PRO DIALOGY PRO TABULKY - POKUS 2*/
/**
 * Komponenta pro textova policka
 * props:
 * nameLabel - hodnota pro label
 * name - jmeno promenne formiku
 * pak jsou tam rozlozene propsy formiku
 * */
export const TextItem = (props) => (
    <Grid item >
        <Field as={TextField}
               fullWidth
               multiline
               label={props.nameLabel}
               name={props.name}
               error={props.touched[props.name] !== undefined && props.errors[props.name] !== undefined}
               helperText={props.touched[props.name] && props.errors[props.name]}
               disabled={props.disabled}
        />
    </Grid>
);

/**
 * Policka pro selectovske policka
 * props:
 * nameLabel - hodnota pro label
 * name - jmeno promenne formiku
 * nullName - nazev "nuloveho" policka u selectu
 * selectValues - hodnoty co maji byt v menu selectu
 * disabled - info zda je komopeneta vypnuta nebo ne
 * pak jsou tam rozlozene propsy formiku
 * */
export const SelectItem = (props) => {
    const labelText = `vyber${props.name}`;
    return (
        <Grid item>
            <FormControl fullWidth error={props.touched[props.name] !== undefined && props.errors[props.name] !== undefined} disabled={props.disabled}>
                <InputLabel id={labelText}>{props.nameLabel}</InputLabel>
                <Field name={props.name} as={Select} labelId={labelText}>
                    <MenuItem value={""} disabled>{props.nullName}</MenuItem>
                    {Object.entries(props.selectValues).map(val => (
                        <MenuItem key={parseInt(val[0])} value={parseInt(val[0])}>
                            {val[1]}
                        </MenuItem>
                    ))}
                </Field>
                <FormHelperText>{props.touched[props.name] && props.errors[props.name]}</FormHelperText>
            </FormControl>
        </Grid>
    );
};

export const lightTheme = {
    axis: {
        ticks: {
            text: {
                fill: "black"
            }
        },
        legend: {
            text: {
                fill: "black"
            }
        }
    },
    tooltip: {
        container: {
            background: 'white',
            color: 'inherit',
        }
    }
};

export const darkTheme = {
    axis: {
        ticks: {
            text: {
                fill: "white"
            }
        },
        legend: {
            text: {
                fill: "white"
            }
        }
    },
    tooltip: {
        container: {
            background: '#424242',
            color: 'inherit',
        }
    }
};

/**
 * Nastylovani TextField aby disabled vypadalo stejne jako normal
 * */
export const DisabledTextField = withStyles(theme =>({
    root: {
        '& label.Mui-disabled': {
            color: theme.palette.text.secondary,
        },
        '& .MuiInput-underline.Mui-disabled:before': {
            borderBottomColor: theme.palette.text.secondary,
            borderBottomStyle: "solid"
        },
        '& .MuiInputBase-input.Mui-disabled': {
            color: theme.palette.text.primary,
        }
    },
}))(TextField);


/**
 * Nastylovani TextField aby disabled vypadalo stejne jako normal
 * */
export const DisabledKeyboardDatePicker = withStyles(theme =>({
    root: {
        '& label.Mui-disabled': {
            color: theme.palette.text.secondary,
        },
        '& .MuiInput-underline.Mui-disabled:before': {
            borderBottomColor: theme.palette.text.secondary,
            borderBottomStyle: "solid"
        },
        '& .MuiInputBase-input.Mui-disabled': {
            color: theme.palette.text.primary,
        }
    },
}))(KeyboardDatePicker);
/**
 * Nastylovani TextField aby disabled vypadalo stejne jako normal
 * */
export const DisabledFormControl = withStyles(theme =>({
    root: {
        '& label.Mui-disabled': {
            color: theme.palette.text.secondary,
        },
        '& .MuiInput-underline.Mui-disabled:before': {
            borderBottomColor: theme.palette.text.secondary,
            borderBottomStyle: "solid"
        },
        '& .MuiInputBase-input.Mui-disabled': {
            color: theme.palette.text.primary,
        }
    },
}))(FormControl);



/**
 * Vytvori lookup, ze ziskanych dat a vrati ho
 * */
export const createLookup = (data, textName) => {
    let newLookup = {};

    data.forEach(item => {
        newLookup[item.id] = item[textName];
    });

    return newLookup;
};

/**
 * Tootlip pouzivany v nekterych grafech
 * */
export const TestTooltip = (props) => (
    <div>
        <span>{props.id}: {props.text}: <strong>{props.value}</strong></span>
    </div>
);
