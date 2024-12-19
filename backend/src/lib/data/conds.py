buy = {"signal":"RSI_14","side":"buy", "cond":{

}}

def make_condition(self, signal_name, side, *args):
        total_conditions = []
        test = len(args)
        # ZERO INDEX IS THE NAME
        for i in range(len(args)):  # Adjust the range as needed
            # print(i)
            if i % 4 == 1:
                # print(f"{i} is the first iteration.{args[i]['ind']}")
                total_conditions.append(args[i]['ind'])
            elif i % 4 == 2:
                # print(f"{i} is the second iteration.{args[i]['cond']}")
                total_conditions.append(args[i]['cond'])
            elif i % 4 == 3:
                # print(f"{i} is the third iteration.{args[i]['val']}")
                total_conditions.append(args[i]['val'])
            else:
                try:
                    # print(f"{i} is the fourth iteration.{args[i]['or_and']}")
                    total_conditions.append(args[i]['or_and'])
                except:
                    continue

        # create string to pass to eval
        expression_parts = []
        for i, value in enumerate(total_conditions):
            if i % 4 == 0:
                expression_parts.append(f'self.df.{value}')
            else:
                expression_parts.append(str(value))
        expression = " ".join(expression_parts)

        print("exp:", expression)
        # evaluate true/false
        self.df[f'{side}_{signal_name}'] = np.where(
            pd.eval(expression, target=self.df), 1, -1)
        self.df[f'{side}_{signal_name}'] = self.df[f'{side}_{signal_name}'].shift(
            1)
