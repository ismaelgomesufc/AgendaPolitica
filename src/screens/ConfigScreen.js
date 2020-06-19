import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  SectionList,
  FlatList,
  ActivityIndicator,
  Dimensions,
  AsyncStorage,
  Platform,
  PixelRatio,
  Switch,
} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import Button from "react-native-button";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { AppIcon, AppStyles } from "../AppStyles";
import api from "../services/api";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import { TextInputMask } from "react-native-masked-text";
import { Configuration } from "../Configuration";
import Constants from "expo-constants";
import Dialog, {
  ScaleAnimation,
  DialogFooter,
  DialogButton,
  DialogContent,
} from "react-native-popup-dialog";

let idLogado = "";
let nomeLogado = "";
let tipoLogado = "";
let data2 = [];
let data3 = [];
const numColumns = 3;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 320;
export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

class ConfigScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "teste",
      idLog: "",
      nomeLog: "",
      tipoLog: "",

      errorMessage: "",
      mensagem: "",
      loading: false,
      disabled: true,
      nome: true,
      telefone: true,
      cpf: false,
      endereco: true,
      local: true,
      secao: true,
      nome_campo: "",
    };
  }

  static navigationOptions = ({ navigation }) => ({});

  verificaCampos2() {
    const { nome_campo } = this.state;
    if (nome_campo.length <= 0) {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  }
  componentDidMount() {
    this.makeRemoteRequest();
  }
  adicionarCampo = async () => {
    const { nome_campo, idLog } = this.state;
    try {
      const response = await api.post("/V_Campos.php", {
        tipo: "1",
        fk_id_candidato: idLog,
        nome_campo: nome_campo,
      });
      this.setState({
        nome_campo: "",
        disabled: true,
      });
    } catch (e) {
      console.log(e);
    }
  };
  alteraCampos = async () => {
    const { nome, telefone, cpf, endereco, local, secao } = this.state;
    try {
      const response = await api.post("/V_Candidato.php", {
        tipo: "4",
        idLog,
        nome,
        telefone,
        cpf,
        endereco,
        local,
        secao,
      });
      this.setState({mensagem: response.data});
    } catch (e) {
      console.log(e);
    }
  };
  makeRemoteRequest = async () => {
    this.state.token = await AsyncStorage.getItem("@PoliNet_token");

    const { token } = this.state;

    try {
      const response = await api.post("/V_User.php", {
        tipo: "3",
        token,
      });

      console.log(response.data);
      const { nome, id, tipo } = response.data;
      nomeLogado = nome;
      idLogado = id;
      tipoLogado = tipo;

      this.setState({ idLog: id });
      this.setState({ nomeLog: nome });
      this.setState({ tipoLog: tipo });

      console.log(idLogado + ", " + nomeLogado + ", " + tipoLogado);
      this.setState({ loading: true });
      const { idLog } = this.state;
      console.log(idLog);
    } catch (e) {
      admin19946;
      console.log(e);
    }
  };
  render() {
    if (tipoLogado == "candidato") {
      const { disabled } = this.state;
      const { nome_campo } = this.state;
      return (
        <ScrollView style={styles.container}>
          <View style={styles.containerForm}>
            <View style={styles.containerForm1}>
              <Text style={{ flex: 1, textAlign: "center" }}>
                Campos a serem preenchidos no formulário de novo apoiador
              </Text>
              <View style={styles.InputContainer}>
                <View style={{ padding: 10 }}>
                  <Text>Nome</Text>
                  <Switch value={this.state.nome} onValueChange={(v) => {}} />
                </View>
                <View style={{ padding: 10 }}>
                  <Text>Telefone</Text>
                  <Switch
                    value={this.state.telefone}
                    onValueChange={(v) => {}}
                  />
                </View>
                <View style={{ padding: 10 }}>
                  <Text>CPF</Text>
                  <Switch
                    value={this.state.cpf}
                    onValueChange={(v) => {
                      this.setState({ cpf: v });
                    }}
                  />
                </View>
              </View>
              <View style={styles.InputContainer}>
                <View style={{ padding: 10 }}>
                  <Text>Bairro/Distrito</Text>
                  <Switch
                    value={this.state.local}
                    onValueChange={(v) => {
                      this.setState({ local: v });
                    }}
                  />
                </View>
                <View style={{ padding: 10 }}>
                  <Text>Endereço</Text>
                  <Switch
                    value={this.state.endereco}
                    onValueChange={(v) => {
                      this.setState({ endereco: v });
                    }}
                  />
                </View>
                <View style={{ padding: 10 }}>
                  <Text>Seção</Text>
                  <Switch
                    value={this.state.secao}
                    onValueChange={(v) => {
                      this.setState({ secao: v });
                    }}
                  />
                </View>
              </View>
            </View>
            <Text>{this.state.mensagem}</Text>
            <Button
              containerStyle={[styles.facebookContainer]}
              style={styles.facebookText}
              onPress={() => {
                this.alteraCampos();
              }}
            >
              Aplicar
            </Button>
            <Text style={{ flex: 1, marginTop: 10, textAlign: "center" }}>
              Campos personalizados
            </Text>
            <View style={styles.containerForm2}>
              <View style={styles.InputContainer1}>
                <View style={{ padding: 10 }}>
                  <TextInput
                    style={styles.body}
                    placeholder="Nome do campo"
                    value={nome_campo}
                    onChangeText={(text) => {
                      this.setState({ nome_campo: text });
                      this.verificaCampos2();
                    }}
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>

              <Button
                containerStyle={[styles.facebookContainer1]}
                style={styles.facebookText1}
                disabled={disabled}
                disabledContainerStyle={{ backgroundColor: "#547397" }}
                styleDisabled={{ color: "white" }}
                onPress={() => {
                  this.adicionarCampo();
                  this.setState({ visible: true });
                }}
              >
                +
              </Button>
            </View>
          </View>
        </ScrollView>
      );
    } else {
      const { disabled } = this.state;
      return (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Tela de configuração :D</Text>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 1,
    padding: Configuration.home.listing_item.offset,
  },
  containerForm: {
    flex: 1,
    alignItems: "center",
  },
  containerForm1: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  title: {
    justifyContent: "center",
    /*fontSize: AppStyles.fontSize.normal,
    fontWeight: "normal",
    textAlign: "center",
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,*/
  },
  InputContainer: {
    flexDirection: "row",
    paddingLeft: normalize(10),
  },
  containerForm2: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  InputContainer1: {
    width: "87%",
    marginBottom: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
    marginEnd: "3%",
  },
  facebookContainer1: {
    width: "10%",
    backgroundColor: AppStyles.color.tint,
    borderRadius: 50,
    height: "60%",
    marginBottom: 30,
  },
  facebookText1: {
    color: AppStyles.color.white,
    fontSize: normalize(30),
  },
  facebookContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ConfigScreen);
